use std::sync::Arc;

use async_trait::async_trait;
use diesel::prelude::*;
use diesel_async::AsyncConnection;
use diesel_async::RunQueryDsl;
use diesel_async::scoped_futures::ScopedFutureExt;
use sui_indexer_alt_framework::pipeline::Processor;
use sui_indexer_alt_framework::pipeline::sequential::Handler;
use sui_indexer_alt_framework::postgres;
use sui_indexer_alt_framework::types::full_checkpoint_content::Checkpoint;
use sui_types::base_types::ObjectID;

use crate::db::models::NewArtifactContributor;
use crate::db::schema::artifact_contributor;
use crate::events::ContributorEvent;
use super::{bytes_to_hex, is_transient_error};

const CONTRIBUTOR_MODULE: &str = "contributor";
const CONTRIBUTOR_EVENT_TYPE: &str = "ContributorEvent";

pub struct ContributorPipeline {
    pub package_id: ObjectID,
}

impl ContributorPipeline {
    pub(crate) async fn commit_to_conn<C>(
        batch: &[ContributorEvent],
        conn: &mut C,
    ) -> anyhow::Result<usize>
    where
        C: AsyncConnection<Backend = diesel::pg::Pg>,
    {
        if batch.is_empty() {
            return Ok(0);
        }

        let upserts: Vec<NewArtifactContributor> = batch.iter()
            .filter_map(|ev| ev.role.map(|r| NewArtifactContributor {
                root_id: bytes_to_hex(&ev.root_id),
                creator: bytes_to_hex(&ev.creator),
                role: r as i16,
            }))
            .collect();

        let (root_ids_to_delete, creators_to_delete): (Vec<String>, Vec<String>) = batch.iter()
            .filter(|ev| ev.role.is_none())
            .map(|ev| (bytes_to_hex(&ev.root_id), bytes_to_hex(&ev.creator)))
            .unzip();

        let total = batch.len();

        // Up to 3 retries (4 total attempts) on transient serialization failures.
        let mut attempt = 0u32;
        loop {
            let upserts_c = upserts.clone();
            let root_ids_c = root_ids_to_delete.clone();
            let creators_c = creators_to_delete.clone();

            let result: Result<(), diesel::result::Error> = conn.transaction(|conn| {
                async move {
                    if !upserts_c.is_empty() {
                        use diesel::upsert::excluded;
                        diesel::insert_into(artifact_contributor::table)
                            .values(&upserts_c)
                            .on_conflict((artifact_contributor::root_id, artifact_contributor::creator))
                            .do_update()
                            .set(artifact_contributor::role.eq(excluded(artifact_contributor::role)))
                            .execute(conn)
                            .await?;
                    }

                    if !root_ids_c.is_empty() {
                        diesel::sql_query(
                            "DELETE FROM artifact_contributor \
                             USING (SELECT unnest($1::text[]) AS r, unnest($2::text[]) AS c) AS t \
                             WHERE root_id = t.r AND creator = t.c"
                        )
                        .bind::<diesel::sql_types::Array<diesel::sql_types::Text>, _>(root_ids_c)
                        .bind::<diesel::sql_types::Array<diesel::sql_types::Text>, _>(creators_c)
                        .execute(conn)
                        .await?;
                    }

                    Ok(())
                }
                .scope_boxed()
            })
            .await;

            match result {
                Ok(()) => return Ok(total),
                Err(ref e) if attempt < 3 && is_transient_error(e) => {
                    tracing::warn!(attempt, "transient DB error in contributor commit, retrying: {e}");
                    tokio::time::sleep(std::time::Duration::from_millis(50u64 * (1 << attempt))).await;
                    attempt += 1;
                }
                Err(e) => return Err(anyhow::anyhow!(e)),
            }
        }
    }
}

#[async_trait]
impl Processor for ContributorPipeline {
    const NAME: &'static str = "contributor";
    type Value = ContributorEvent;

    async fn process(&self, checkpoint: &Arc<Checkpoint>) -> anyhow::Result<Vec<Self::Value>> {
        let mut results = Vec::new();

        for tx in &checkpoint.transactions {
            let Some(tx_events) = &tx.events else { continue };

            for e in &tx_events.data {
                if e.package_id != self.package_id { continue }
                if e.type_.module.as_str() != CONTRIBUTOR_MODULE { continue }
                if e.type_.name.as_str() != CONTRIBUTOR_EVENT_TYPE { continue }

                match bcs::from_bytes::<ContributorEvent>(&e.contents) {
                    Ok(ev) => results.push(ev),
                    Err(err) => tracing::warn!("Failed to deserialize ContributorEvent: {err}"),
                }
            }
        }

        Ok(results)
    }
}

#[async_trait]
impl Handler for ContributorPipeline {
    type Store = postgres::Db;
    type Batch = Vec<ContributorEvent>;

    fn batch(&self, batch: &mut Self::Batch, values: std::vec::IntoIter<Self::Value>) {
        batch.extend(values);
    }

    async fn commit<'a>(
        &self,
        batch: &Self::Batch,
        conn: &mut postgres::Connection<'a>,
    ) -> anyhow::Result<usize> {
        Self::commit_to_conn(batch, conn).await
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use diesel_async::AsyncConnection;

    fn test_db_url() -> Option<String> {
        std::env::var("TEST_DATABASE_URL").ok()
    }

    static MIGRATED: std::sync::OnceLock<()> = std::sync::OnceLock::new();

    fn ensure_migrated(url: &str) {
        MIGRATED.get_or_init(|| {
            use diesel_migrations::MigrationHarness;
            let mut conn = diesel::PgConnection::establish(url)
                .expect("TEST_DATABASE_URL connection failed");
            conn.run_pending_migrations(crate::MIGRATIONS).expect("migrations failed");
        });
    }

    async fn open_test_conn(url: &str) -> diesel_async::AsyncPgConnection {
        let mut conn = diesel_async::AsyncPgConnection::establish(url)
            .await
            .expect("async TEST_DATABASE_URL connection failed");
        conn.begin_test_transaction().await.expect("begin_test_transaction failed");
        conn
    }

    fn make_add_event(root_id: u8, creator: u8, role: u8) -> ContributorEvent {
        ContributorEvent {
            role: Some(role),
            creator: [creator; 32],
            root_id: [root_id; 32],
        }
    }

    fn make_remove_event(root_id: u8, creator: u8) -> ContributorEvent {
        ContributorEvent {
            role: None,
            creator: [creator; 32],
            root_id: [root_id; 32],
        }
    }

    // Seed an artifact row so FK constraint on artifact_contributor is satisfied.
    async fn seed_artifact(conn: &mut diesel_async::AsyncPgConnection, id: u8) {
        use crate::db::schema::artifact;
        use super::bytes_to_hex;
        use diesel_async::RunQueryDsl;

        diesel::insert_into(artifact::table)
            .values((
                artifact::sui_object_id.eq(bytes_to_hex(&[id; 32])),
                artifact::title.eq("test"),
                artifact::description.eq("test"),
                artifact::version.eq(1i64),
                artifact::creator.eq(bytes_to_hex(&[id; 32])),
                artifact::category.eq("test"),
                artifact::created_at.eq(0i64),
                artifact::total_size_bytes.eq(0i64),
            ))
            .execute(conn)
            .await
            .unwrap();
    }

    #[tokio::test]
    async fn add_role_inserts_contributor() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA1).await;

        let batch = vec![make_add_event(0xA1, 0xB1, 1)];
        let count = ContributorPipeline::commit_to_conn(&batch, &mut conn).await.unwrap();
        assert_eq!(count, 1);

        use crate::db::schema::artifact_contributor;
        use diesel_async::RunQueryDsl;

        let role: i16 = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(bytes_to_hex(&[0xA1u8; 32])))
            .filter(artifact_contributor::creator.eq(bytes_to_hex(&[0xB1u8; 32])))
            .select(artifact_contributor::role)
            .first(&mut conn)
            .await
            .unwrap();
        assert_eq!(role, 1);
    }

    #[tokio::test]
    async fn remove_role_deletes_contributor() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA2).await;

        ContributorPipeline::commit_to_conn(&[make_add_event(0xA2, 0xB2, 0)], &mut conn).await.unwrap();

        ContributorPipeline::commit_to_conn(&[make_remove_event(0xA2, 0xB2)], &mut conn).await.unwrap();

        use crate::db::schema::artifact_contributor;
        use diesel_async::RunQueryDsl;

        let remaining: i64 = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(bytes_to_hex(&[0xA2u8; 32])))
            .count()
            .get_result(&mut conn)
            .await
            .unwrap();
        assert_eq!(remaining, 0, "contributor must be deleted");
    }

    #[tokio::test]
    async fn role_update_upserts_not_duplicates() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA3).await;

        ContributorPipeline::commit_to_conn(&[make_add_event(0xA3, 0xB3, 0)], &mut conn).await.unwrap();
        ContributorPipeline::commit_to_conn(&[make_add_event(0xA3, 0xB3, 1)], &mut conn).await.unwrap();

        use crate::db::schema::artifact_contributor;
        use diesel_async::RunQueryDsl;

        let rows: Vec<i16> = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(bytes_to_hex(&[0xA3u8; 32])))
            .select(artifact_contributor::role)
            .load(&mut conn)
            .await
            .unwrap();
        assert_eq!(rows.len(), 1, "must not create duplicate row");
        assert_eq!(rows[0], 1, "role must be updated to latest");
    }

    #[tokio::test]
    async fn replay_same_add_event_is_idempotent() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA4).await;

        let batch = vec![make_add_event(0xA4, 0xB4, 0)];

        ContributorPipeline::commit_to_conn(&batch, &mut conn).await.unwrap();
        ContributorPipeline::commit_to_conn(&batch, &mut conn).await.unwrap();

        use crate::db::schema::artifact_contributor;
        use diesel_async::RunQueryDsl;

        let count: i64 = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(bytes_to_hex(&[0xA4u8; 32])))
            .count()
            .get_result(&mut conn)
            .await
            .unwrap();
        assert_eq!(count, 1, "replay must not create duplicate");
    }

    #[tokio::test]
    async fn batch_with_mixed_add_and_remove() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA5).await;

        ContributorPipeline::commit_to_conn(
            &[make_add_event(0xA5, 0xB5, 0), make_add_event(0xA5, 0xC5, 1)],
            &mut conn,
        ).await.unwrap();

        let count = ContributorPipeline::commit_to_conn(
            &[make_add_event(0xA5, 0xB5, 1), make_remove_event(0xA5, 0xC5)],
            &mut conn,
        ).await.unwrap();
        assert_eq!(count, 2);

        use crate::db::schema::artifact_contributor;
        use diesel_async::RunQueryDsl;

        let rows: Vec<(String, i16)> = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(bytes_to_hex(&[0xA5u8; 32])))
            .select((artifact_contributor::creator, artifact_contributor::role))
            .load(&mut conn)
            .await
            .unwrap();
        assert_eq!(rows.len(), 1, "only B5 should remain");
        assert_eq!(rows[0].0, bytes_to_hex(&[0xB5u8; 32]));
        assert_eq!(rows[0].1, 1, "B5 role must be updated to 1");
    }

    #[tokio::test]
    async fn remove_nonexistent_contributor_is_noop() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        seed_artifact(&mut conn, 0xA6).await;

        let result = ContributorPipeline::commit_to_conn(&[make_remove_event(0xA6, 0xB6)], &mut conn).await;
        assert!(result.is_ok(), "removing nonexistent contributor must not error");
    }

    #[tokio::test]
    async fn empty_batch_returns_zero() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        let result = ContributorPipeline::commit_to_conn(&[], &mut conn).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 0);
    }
}
