use async_graphql::{ComplexObject, Context, EmptySubscription, Enum, InputObject, Object, Schema, SimpleObject};
use async_graphql::dataloader::DataLoader;
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::State;
use axum::response::{Html, IntoResponse};
use diesel::prelude::*;
use serde::Deserialize;

use archive_db::artifact;
use archive_db::artifact_contributor;
use archive_db::artifact_file;
use archive_db::artifact_stats;
use archive_db::artifact_viewer;
use archive_db::platform_stats;
use crate::db::DbPool;
use crate::loaders::{ContributorsLoader, StatsLoader, VersionsLoader};

pub type AppSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

const MAX_PAGE_SIZE: i64 = 200;

pub fn build(pool: DbPool) -> AppSchema {
    Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool.clone())
        .data(DataLoader::new(ContributorsLoader { pool: pool.clone() }, tokio::spawn))
        .data(DataLoader::new(VersionsLoader { pool: pool.clone() }, tokio::spawn))
        .data(DataLoader::new(StatsLoader { pool }, tokio::spawn))
        .finish()
}

pub async fn graphql_playground() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

pub async fn graphql_handler(State(schema): State<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[derive(Queryable, SimpleObject, Clone)]
#[graphql(name = "Contributor")]
pub struct StoredContributor {
    pub creator: String,
    pub role: i16,
}

#[derive(Queryable, SimpleObject, Deserialize, Clone)]
#[graphql(name = "Artifact", complex)]
pub struct StoredArtifact {
    pub sui_object_id: String,
    pub root_id: Option<String>,
    pub parent_id: Option<String>,
    pub title: String,
    pub description: String,
    pub version: i64,
    pub creator: String,
    pub category: String,
    pub created_at: i64,
    pub total_size_bytes: i64,
}

impl StoredArtifact {
    fn root_id_str(&self) -> &str {
        self.root_id.as_deref().unwrap_or(&self.sui_object_id)
    }
}

#[ComplexObject]
impl StoredArtifact {
    async fn versions(&self, ctx: &Context<'_>) -> async_graphql::Result<Vec<StoredArtifact>> {
        let loader = ctx.data::<DataLoader<VersionsLoader>>()?;
        let root = self.root_id_str().to_string();
        Ok(loader.load_one(root).await?.unwrap_or_default())
    }

    async fn contributors(&self, ctx: &Context<'_>) -> async_graphql::Result<Vec<StoredContributor>> {
        let loader = ctx.data::<DataLoader<ContributorsLoader>>()?;
        let root = self.root_id_str().to_string();
        Ok(loader.load_one(root).await?.unwrap_or_default())
    }

    async fn stats(&self, ctx: &Context<'_>) -> async_graphql::Result<StoredArtifactStats> {
        let loader = ctx.data::<DataLoader<StatsLoader>>()?;
        let root = self.root_id_str().to_string();
        Ok(loader.load_one(root).await?.unwrap_or(StoredArtifactStats { view_count: 0, download_count: 0 }))
    }
}

#[derive(Queryable, SimpleObject, Clone)]
#[graphql(name = "ArtifactStats")]
pub struct StoredArtifactStats {
    pub view_count: i64,
    pub download_count: i64,
}

#[derive(Queryable, SimpleObject)]
#[graphql(name = "ArtifactFile")]
pub struct StoredArtifactFile {
    pub patch_id: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub name: String,
    pub hash: String,
}

#[derive(SimpleObject)]
#[graphql(name = "ArtifactDetail")]
pub struct ArtifactDetail {
    #[graphql(flatten)]
    pub artifact: StoredArtifact,
    pub files: Vec<StoredArtifactFile>,
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum SortField {
    CreatedAtDesc,
    CreatedAtAsc,
    ViewCountDesc,
    DownloadCountDesc,
}

#[derive(InputObject)]
pub struct ArtifactFilter {
    pub category: Option<Vec<String>>,
    pub creator: Option<String>,
    pub root_id: Option<String>,
    pub search: Option<String>,
    pub only_roots: Option<bool>,
}

#[derive(SimpleObject)]
pub struct ArtifactConnection {
    pub items: Vec<StoredArtifact>,
    pub total_count: i64,
}

#[derive(Queryable, SimpleObject)]
#[graphql(name = "PlatformStats")]
pub struct StoredPlatformStats {
    #[graphql(skip)]
    pub id: i32,
    pub total_size_bytes: i64,
}

fn stats_sort_sql(column: &str) -> diesel::expression::SqlLiteral<diesel::sql_types::BigInt> {
    diesel::dsl::sql::<diesel::sql_types::BigInt>(&format!(
        "COALESCE((SELECT {column} FROM artifact_stats \
         WHERE root_id = COALESCE(artifact.root_id, artifact.sui_object_id)), 0) DESC"
    ))
}

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn artifacts(
        &self,
        ctx: &Context<'_>,
        filter: Option<ArtifactFilter>,
        #[graphql(default = 20)] limit: i64,
        #[graphql(default = 0)] offset: i64,
        #[graphql(default_with = "SortField::CreatedAtDesc")] sort: SortField,
    ) -> async_graphql::Result<ArtifactConnection> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let limit = limit.clamp(1, MAX_PAGE_SIZE);

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        macro_rules! apply_filter {
            ($q:ident, $f:expr) => {
                if let Some(f) = $f {
                    if let Some(cats) = &f.category {
                        if !cats.is_empty() {
                            $q = $q.filter(artifact::category.eq_any(cats));
                        }
                    }
                    if let Some(creator) = &f.creator {
                        $q = $q.filter(artifact::creator.eq(creator));
                    }
                    if let Some(root) = &f.root_id {
                        $q = $q.filter(artifact::root_id.eq(root));
                    }
                    if let Some(search) = &f.search {
                        $q = $q.filter(
                            diesel::dsl::sql::<diesel::sql_types::Bool>(
                                "to_tsvector('english', title || ' ' || description) \
                                 @@ plainto_tsquery('english', "
                            )
                            .bind::<diesel::sql_types::Text, _>(search.as_str())
                            .sql(")")
                        );
                    }
                    if f.only_roots.unwrap_or(false) {
                        // Return the latest version per tree:
                        //   • Trees with children → their latest_artifact_id from artifact_version_counts.
                        //   • Root-only artifacts (no children) → the root row itself.
                        $q = $q.filter(diesel::dsl::sql::<diesel::sql_types::Bool>(
                            "artifact.sui_object_id IN (\
                                SELECT latest_artifact_id FROM artifact_version_counts \
                                WHERE latest_artifact_id IS NOT NULL \
                                UNION ALL \
                                SELECT sui_object_id FROM artifact \
                                WHERE root_id IS NULL \
                                AND sui_object_id NOT IN (SELECT root_id FROM artifact_version_counts)\
                            )"
                        ));
                    }
                }
            };
        }

        let total_count: i64 = if ctx.look_ahead().field("totalCount").exists() {
            let mut count_q = artifact::table.into_boxed();
            apply_filter!(count_q, &filter);
            AsyncDsl::get_result(count_q.count(), &mut conn).await?
        } else {
            0
        };

        let mut items_q = artifact::table.into_boxed();
        apply_filter!(items_q, &filter);
        let sorted = match sort {
            SortField::CreatedAtDesc => items_q.order(artifact::created_at.desc()),
            SortField::CreatedAtAsc  => items_q.order(artifact::created_at.asc()),
            SortField::ViewCountDesc     => items_q.order(stats_sort_sql("view_count")),
            SortField::DownloadCountDesc => items_q.order(stats_sort_sql("download_count")),
        };

        let items: Vec<StoredArtifact> = AsyncDsl::load(
            sorted.select(artifact::all_columns)
                .limit(limit)
                .offset(offset),
            &mut conn,
        )
        .await?;

        Ok(ArtifactConnection { items, total_count })
    }

    async fn artifact(
        &self,
        ctx: &Context<'_>,
        sui_object_id: String,
    ) -> async_graphql::Result<Option<ArtifactDetail>> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        let result = AsyncDsl::first::<StoredArtifact>(
            artifact::table
                .filter(artifact::sui_object_id.eq(&sui_object_id))
                .select(artifact::all_columns),
            &mut conn,
        )
        .await
        .optional()?;

        let Some(artifact_row) = result else {
            return Ok(None);
        };

        let files: Vec<StoredArtifactFile> = AsyncDsl::load(
            artifact_file::table
                .filter(artifact_file::artifact_id.eq(&sui_object_id))
                .select((
                    artifact_file::patch_id,
                    artifact_file::mime_type,
                    artifact_file::size_bytes,
                    artifact_file::name,
                    artifact_file::hash,
                )),
            &mut conn,
        )
        .await?;

        Ok(Some(ArtifactDetail {
            artifact: artifact_row,
            files,
        }))
    }

    async fn artifact_versions(
        &self,
        ctx: &Context<'_>,
        root_id: String,
    ) -> async_graphql::Result<Vec<StoredArtifact>> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        let artifacts: Vec<StoredArtifact> = AsyncDsl::load(
            artifact::table
                .filter(
                    artifact::sui_object_id.eq(&root_id)
                        .or(artifact::root_id.eq(&root_id))
                )
                .select(artifact::all_columns)
                .order(artifact::version.asc()),
            &mut conn,
        )
        .await?;

        Ok(artifacts)
    }

    async fn platform_stats(
        &self,
        ctx: &Context<'_>,
    ) -> async_graphql::Result<StoredPlatformStats> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        let stats: StoredPlatformStats = AsyncDsl::first(
            platform_stats::table.select(platform_stats::all_columns),
            &mut conn,
        )
        .await?;

        Ok(stats)
    }

    async fn artifact_contributors(
        &self,
        ctx: &Context<'_>,
        root_id: String,
    ) -> async_graphql::Result<Vec<StoredContributor>> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        Ok(AsyncDsl::load(
            artifact_contributor::table
                .filter(artifact_contributor::root_id.eq(&root_id))
                .select((artifact_contributor::creator, artifact_contributor::role)),
            &mut conn,
        ).await?)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_artifact(sui_object_id: &str, root_id: Option<&str>) -> StoredArtifact {
        StoredArtifact {
            sui_object_id: sui_object_id.to_string(),
            root_id: root_id.map(str::to_string),
            parent_id: None,
            title: String::new(),
            description: String::new(),
            version: 1,
            creator: String::new(),
            category: String::new(),
            created_at: 0,
            total_size_bytes: 0,
        }
    }

    #[test]
    fn root_id_str_returns_root_id_when_present() {
        let a = make_artifact("0xobj", Some("0xroot"));
        assert_eq!(a.root_id_str(), "0xroot");
    }

    #[test]
    fn root_id_str_falls_back_to_sui_object_id_for_root_artifacts() {
        let a = make_artifact("0xobj", None);
        assert_eq!(a.root_id_str(), "0xobj");
    }

    #[test]
    fn page_size_clamps_above_max() {
        assert_eq!(1000i64.clamp(1, MAX_PAGE_SIZE), MAX_PAGE_SIZE);
    }

    #[test]
    fn page_size_clamps_zero_to_one() {
        assert_eq!(0i64.clamp(1, MAX_PAGE_SIZE), 1);
    }

    #[test]
    fn page_size_clamps_negative_to_one() {
        assert_eq!((-5i64).clamp(1, MAX_PAGE_SIZE), 1);
    }

    #[test]
    fn page_size_passes_through_valid_value() {
        let mid = MAX_PAGE_SIZE / 2;
        assert_eq!(mid.clamp(1, MAX_PAGE_SIZE), mid);
    }

    #[test]
    fn page_size_exact_max_is_allowed() {
        assert_eq!(MAX_PAGE_SIZE.clamp(1, MAX_PAGE_SIZE), MAX_PAGE_SIZE);
    }

}

pub struct MutationRoot;

#[Object]
impl MutationRoot {
    async fn increment_view(
        &self,
        ctx: &Context<'_>,
        root_id: String,
        viewer_address: String,
    ) -> async_graphql::Result<bool> {
        use diesel_async::scoped_futures::ScopedFutureExt;
        use diesel_async::{AsyncConnection, RunQueryDsl as AsyncDsl};

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        let is_new = conn
            .transaction(|conn| {
                async move {
                    let inserted = AsyncDsl::execute(
                        diesel::insert_into(artifact_viewer::table)
                            .values((
                                artifact_viewer::root_id.eq(&root_id),
                                artifact_viewer::viewer_address.eq(&viewer_address),
                            ))
                            .on_conflict((
                                artifact_viewer::root_id,
                                artifact_viewer::viewer_address,
                            ))
                            .do_nothing(),
                        conn,
                    )
                    .await?;

                    if inserted > 0 {
                        AsyncDsl::execute(
                            diesel::insert_into(artifact_stats::table)
                                .values((
                                    artifact_stats::root_id.eq(&root_id),
                                    artifact_stats::view_count.eq(1i64),
                                ))
                                .on_conflict(artifact_stats::root_id)
                                .do_update()
                                .set(
                                    artifact_stats::view_count
                                        .eq(artifact_stats::view_count + 1i64),
                                ),
                            conn,
                        )
                        .await?;
                    }

                    Ok::<bool, diesel::result::Error>(inserted > 0)
                }
                .scope_boxed()
            })
            .await?;

        Ok(is_new)
    }

    async fn increment_download(
        &self,
        ctx: &Context<'_>,
        root_id: String,
    ) -> async_graphql::Result<bool> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        AsyncDsl::execute(
            diesel::insert_into(artifact_stats::table)
                .values((
                    artifact_stats::root_id.eq(&root_id),
                    artifact_stats::download_count.eq(1i64),
                ))
                .on_conflict(artifact_stats::root_id)
                .do_update()
                .set(artifact_stats::download_count.eq(artifact_stats::download_count + 1i64)),
            &mut conn,
        )
        .await?;

        Ok(true)
    }
}

// DB integration tests live in their own module so they don't inherit
// `use diesel::prelude::*` from the parent.
//
// IMPORTANT: diesel_async has a blanket `impl<T, Conn> RunQueryDsl<Conn> for T`,
// so its `execute(self, conn)` (taking owned self) beats async_graphql's inherent
// `execute(&self, request)` in method resolution whenever RunQueryDsl is in scope.
// We prevent this by importing RunQueryDsl only inside inner blocks that appear
// AFTER the GraphQL call in each test.
#[cfg(test)]
mod db_integration_tests {
    use super::{build, AppSchema};
    use async_graphql::Request as GqlRequest;
    use diesel_async::AsyncPgConnection;
    use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};

    static MIGRATED: std::sync::OnceLock<()> = std::sync::OnceLock::new();
    static TEST_SEQ: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);

    const MIGRATIONS: EmbeddedMigrations = embed_migrations!("../indexer/migrations");

    fn test_db_url() -> Option<String> {
        std::env::var("TEST_DATABASE_URL").ok()
    }

    fn ensure_migrated(url: &str) {
        MIGRATED.get_or_init(|| {
            use diesel::Connection;
            let mut conn = diesel::PgConnection::establish(url)
                .expect("TEST_DATABASE_URL connection failed");
            conn.run_pending_migrations(MIGRATIONS).expect("migrations failed");
        });
    }

    fn unique_root_id(label: &str) -> String {
        let n = TEST_SEQ.fetch_add(1, std::sync::atomic::Ordering::Relaxed);
        format!("0x_gql_test_{label}_{n:016x}")
    }

    async fn make_schema_and_conn(url: &str) -> (AppSchema, AsyncPgConnection) {
        use diesel_async::AsyncConnection;
        let pool = crate::db::create_pool(url.parse().unwrap()).await.unwrap();
        let schema = build(pool);
        let conn = AsyncPgConnection::establish(url).await.unwrap();
        (schema, conn)
    }

    #[tokio::test]
    async fn increment_view_creates_row_on_first_call() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let (schema, mut conn) = make_schema_and_conn(&url).await;

        let root = unique_root_id("view_create");
        // RunQueryDsl is NOT in scope here, so schema.execute resolves to
        // async_graphql::Schema::execute(&self, impl Into<Request>).
        let result = schema.execute(GqlRequest::new(
            format!(r#"mutation {{ incrementView(rootId: "{root}", viewerAddress: "0xaaa") }}"#),
        )).await;
        assert!(result.errors.is_empty(), "{:?}", result.errors);

        // Import diesel only after the GraphQL call to avoid method-resolution conflict.
        {
            use archive_db::artifact_stats;
            use diesel::ExpressionMethods;
            use diesel::QueryDsl;
            use diesel_async::RunQueryDsl;

            let count: i64 = artifact_stats::table
                .filter(artifact_stats::root_id.eq(&root))
                .select(artifact_stats::view_count)
                .first(&mut conn).await.unwrap();
            assert_eq!(count, 1);
        }
    }

    #[tokio::test]
    async fn increment_view_deduplicates_same_address() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let (schema, mut conn) = make_schema_and_conn(&url).await;

        let root = unique_root_id("view_dedup");
        // Same address 3 times → count must be 1.
        for _ in 0..3 {
            schema.execute(GqlRequest::new(
                format!(r#"mutation {{ incrementView(rootId: "{root}", viewerAddress: "0xaaa") }}"#),
            )).await;
        }
        // Different address → count must become 2.
        schema.execute(GqlRequest::new(
            format!(r#"mutation {{ incrementView(rootId: "{root}", viewerAddress: "0xbbb") }}"#),
        )).await;

        {
            use archive_db::artifact_stats;
            use diesel::ExpressionMethods;
            use diesel::QueryDsl;
            use diesel_async::RunQueryDsl;

            let count: i64 = artifact_stats::table
                .filter(artifact_stats::root_id.eq(&root))
                .select(artifact_stats::view_count)
                .first(&mut conn).await.unwrap();
            assert_eq!(count, 2);
        }
    }

    #[tokio::test]
    async fn increment_download_is_independent_of_view_count() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let (schema, mut conn) = make_schema_and_conn(&url).await;

        let root = unique_root_id("dl_ind");
        schema.execute(GqlRequest::new(format!(r#"mutation {{ incrementView(rootId: "{root}", viewerAddress: "0xaaa") }}"#))).await;
        schema.execute(GqlRequest::new(format!(r#"mutation {{ incrementView(rootId: "{root}", viewerAddress: "0xbbb") }}"#))).await;
        schema.execute(GqlRequest::new(format!(r#"mutation {{ incrementDownload(rootId: "{root}") }}"#))).await;

        {
            use archive_db::artifact_stats;
            use diesel::ExpressionMethods;
            use diesel::QueryDsl;
            use diesel_async::RunQueryDsl;

            let (views, downloads): (i64, i64) = artifact_stats::table
                .filter(artifact_stats::root_id.eq(&root))
                .select((artifact_stats::view_count, artifact_stats::download_count))
                .first(&mut conn).await.unwrap();
            assert_eq!(views, 2);
            assert_eq!(downloads, 1);
        }
    }

    #[tokio::test]
    async fn artifact_query_returns_null_for_unknown_id() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let (schema, _) = make_schema_and_conn(&url).await;

        let result = schema.execute(GqlRequest::new(
            r#"{ artifact(suiObjectId: "0x_does_not_exist") { suiObjectId } }"#,
        )).await;
        assert!(result.errors.is_empty());
        assert!(result.data.into_json().unwrap()["artifact"].is_null());
    }

    #[tokio::test]
    async fn artifacts_returns_empty_for_unknown_creator() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let (schema, _) = make_schema_and_conn(&url).await;

        let result = schema.execute(GqlRequest::new(
            r#"{ artifacts(filter: { creator: "0x_no_such_creator" }) { totalCount items { suiObjectId } } }"#,
        )).await;
        assert!(result.errors.is_empty());
        let json = result.data.into_json().unwrap();
        assert_eq!(json["artifacts"]["totalCount"], 0);
        assert_eq!(json["artifacts"]["items"].as_array().unwrap().len(), 0);
    }
}
