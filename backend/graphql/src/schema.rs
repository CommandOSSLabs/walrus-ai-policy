use async_graphql::{ComplexObject, Context, EmptyMutation, EmptySubscription, Enum, InputObject, Object, Schema, SimpleObject};
use async_graphql::http::{GraphQLPlaygroundConfig, playground_source};
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::State;
use axum::response::{Html, IntoResponse};
use chrono::NaiveDate;
use diesel::prelude::*;
use serde::Deserialize;

use archive_db::artifact;
use crate::db::DbPool;

pub type AppSchema = Schema<QueryRoot, EmptyMutation, EmptySubscription>;

const MAX_PAGE_SIZE: i64 = 200;

pub fn build(pool: DbPool) -> AppSchema {
    Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(pool)
        .finish()
}

pub async fn graphql_playground() -> impl IntoResponse {
    Html(playground_source(GraphQLPlaygroundConfig::new("/graphql")))
}

pub async fn graphql_handler(State(schema): State<AppSchema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}

#[derive(SimpleObject, Deserialize)]
pub struct Author {
    pub name: String,
    pub orcid: Option<String>,
    pub affiliation: Option<String>,
}

#[derive(Queryable, SimpleObject)]
#[graphql(name = "ArtifactSummary", complex)]
#[allow(dead_code)]
pub struct StoredArtifact {
    pub sui_object_id: String,
    #[graphql(skip)]
    pub owner: String,
    pub title: String,
    pub description: String,
    pub topics: Vec<String>,
    #[graphql(skip)]
    pub categories: Vec<String>,
    // Loaded as raw JSON from Diesel; exposed via the complex resolver below.
    #[graphql(skip)]
    pub authors_raw: serde_json::Value,
    pub institution: String,
    pub published_date: NaiveDate,
    pub license: String,
    pub tags: Vec<String>,
    pub revision_of: Option<String>,
    pub created_epoch: i64,
    #[graphql(skip)]
    pub updated_epoch: i64,
    pub file_count: i32,
}

#[ComplexObject]
impl StoredArtifact {
    async fn authors(&self) -> Vec<Author> {
        serde_json::from_value(self.authors_raw.clone()).unwrap_or_default()
    }
}

#[derive(Enum, Copy, Clone, Eq, PartialEq)]
pub enum SortField {
    CreatedEpochDesc,
    CreatedEpochAsc,
    PublishedDateDesc,
    PublishedDateAsc,
}

#[derive(InputObject)]
pub struct ArtifactFilter {
    pub topics: Option<Vec<String>>,
    pub search: Option<String>,
    pub institution: Option<String>,
    pub published_date_from: Option<String>,
    pub published_date_to: Option<String>,
}

#[derive(SimpleObject)]
pub struct ArtifactConnection {
    pub items: Vec<StoredArtifact>,
    pub total_count: i64,
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
        #[graphql(default_with = "SortField::CreatedEpochDesc")] sort: SortField,
    ) -> async_graphql::Result<ArtifactConnection> {
        // diesel_async::RunQueryDsl is scoped here to avoid name collision with
        // diesel::RunQueryDsl (from prelude) on .get_result / .load / .first.
        // Terminal async calls use UFCS (Trait::method(receiver, conn)) so the
        // trait need not be in scope and there is no ambiguity.
        use diesel_async::RunQueryDsl as AsyncDsl;

        let limit = limit.clamp(1, MAX_PAGE_SIZE);

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        // Parse date filter strings once so errors surface early and the parsed
        // values can be shared across both the count and items queries.
        let date_from = filter
            .as_ref()
            .and_then(|f| f.published_date_from.as_deref())
            .map(|s| NaiveDate::parse_from_str(s, "%Y-%m-%d"))
            .transpose()
            .map_err(|e| async_graphql::Error::new(format!("Invalid published_date_from: {e}")))?;

        let date_to = filter
            .as_ref()
            .and_then(|f| f.published_date_to.as_deref())
            .map(|s| NaiveDate::parse_from_str(s, "%Y-%m-%d"))
            .transpose()
            .map_err(|e| async_graphql::Error::new(format!("Invalid published_date_to: {e}")))?;

        // Diesel boxed queries don't support named-closure filter application due to type
        // erasure. Use a macro so the filter logic is defined once but applied to two
        // independent boxed queries (count and items).
        macro_rules! apply_filter {
            ($q:ident, $f:expr) => {
                if let Some(f) = $f {
                    if let Some(topics) = &f.topics {
                        $q = $q.filter(artifact::topics.overlaps_with(topics));
                    }
                    if let Some(inst) = &f.institution {
                        $q = $q.filter(artifact::institution.eq(inst));
                    }
                    if let Some(from) = date_from {
                        $q = $q.filter(artifact::published_date.ge(from));
                    }
                    if let Some(to) = date_to {
                        $q = $q.filter(artifact::published_date.le(to));
                    }
                    if let Some(search) = &f.search {
                        // plainto_tsquery parses plain text — no tsquery injection surface.
                        $q = $q.filter(
                            diesel::dsl::sql::<diesel::sql_types::Bool>(
                                "to_tsvector('english', title || ' ' || institution || ' ' || description) \
                                 @@ plainto_tsquery('english', "
                            )
                            .bind::<diesel::sql_types::Text, _>(search.as_str())
                            .sql(")")
                        );
                    }
                }
            };
        }

        let mut count_q = artifact::table.into_boxed();
        apply_filter!(count_q, &filter);
        let total_count: i64 = AsyncDsl::get_result(count_q.count(), &mut conn).await?;

        let mut items_q = artifact::table.into_boxed();
        apply_filter!(items_q, &filter);
        let sorted = match sort {
            SortField::CreatedEpochDesc  => items_q.order(artifact::created_epoch.desc()),
            SortField::CreatedEpochAsc   => items_q.order(artifact::created_epoch.asc()),
            SortField::PublishedDateDesc => items_q.order(artifact::published_date.desc()),
            SortField::PublishedDateAsc  => items_q.order(artifact::published_date.asc()),
        };

        let items: Vec<StoredArtifact> = AsyncDsl::load(
            sorted.select((
                artifact::sui_object_id,
                artifact::owner,
                artifact::title,
                artifact::description,
                artifact::topics,
                artifact::categories,
                artifact::authors,
                artifact::institution,
                artifact::published_date,
                artifact::license,
                artifact::tags,
                artifact::revision_of,
                artifact::created_epoch,
                artifact::updated_epoch,
                artifact::file_count,
            ))
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
    ) -> async_graphql::Result<Option<StoredArtifact>> {
        use diesel_async::RunQueryDsl as AsyncDsl;

        let pool = ctx.data::<DbPool>()?;
        let mut conn = pool.get().await?;

        let result = AsyncDsl::first::<StoredArtifact>(
            artifact::table
                .filter(artifact::sui_object_id.eq(&sui_object_id))
                .select((
                    artifact::sui_object_id,
                    artifact::owner,
                    artifact::title,
                    artifact::description,
                    artifact::topics,
                    artifact::categories,
                    artifact::authors,
                    artifact::institution,
                    artifact::published_date,
                    artifact::license,
                    artifact::tags,
                    artifact::revision_of,
                    artifact::created_epoch,
                    artifact::updated_epoch,
                    artifact::file_count,
                )),
            &mut conn,
        )
        .await
        .optional()?;

        Ok(result)
    }
}
