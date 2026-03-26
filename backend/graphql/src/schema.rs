use async_graphql::{Context, EmptyMutation, EmptySubscription, Enum, InputObject, Object, Schema, SimpleObject};
use async_graphql::http::GraphiQLSource;
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::State;
use axum::response::{Html, IntoResponse};
use diesel::prelude::*;
use serde::Deserialize;

use archive_db::artifact;
use archive_db::artifact_file;
use archive_db::platform_stats;
use crate::db::DbPool;

pub type AppSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

const MAX_PAGE_SIZE: i64 = 200;

pub fn build(pool: DbPool) -> AppSchema {
    Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(pool)
        .finish()
}

pub async fn graphql_playground() -> impl IntoResponse {
    Html(GraphiQLSource::build().endpoint("/graphql").finish())
}

pub async fn graphql_handler(State(schema): State<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[derive(Queryable, SimpleObject, Deserialize)]
#[graphql(name = "Artifact")]
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

#[derive(Queryable, SimpleObject)]
#[graphql(name = "ArtifactFile")]
pub struct StoredArtifactFile {
    pub patch_id: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub file_name: Option<String>,
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
                        $q = $q.filter(artifact::root_id.is_null());
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
                    artifact_file::file_name,
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
    ) -> async_graphql::Result<Vec<String>> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        // All unique creators across the root artifact and every commit in its tree.
        let result: Vec<String> = AsyncDsl::load(
            artifact::table
                .filter(
                    artifact::sui_object_id.eq(&root_id)
                        .or(artifact::root_id.eq(&root_id))
                )
                .select(artifact::creator)
                .distinct(),
            &mut conn,
        )
        .await?;

        Ok(result)
    }
}
