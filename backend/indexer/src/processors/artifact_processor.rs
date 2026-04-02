use std::collections::HashMap;
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
use sui_types::object::Owner;

use crate::db::models::{NewArtifact, NewArtifactContributor, NewArtifactFile};
use crate::db::schema::{artifact, artifact_contributor, artifact_file, artifact_version_counts, platform_stats};
use crate::events::{ArtifactEvent, FieldObject, FileRef, FileInfo};
use super::is_transient_error;

const FILE_REF_DF: u8 = 0;
const ARTIFACT_MODULE: &str = "artifact";
const ARTIFACT_EVENT_TYPE: &str = "ArtifactEvent";

pub struct ArtifactPipeline {
    pub package_id: ObjectID,
}

pub struct ArtifactWithFiles {
    pub event: ArtifactEvent,
    pub files: Vec<FileInfo>,
}

pub(crate) fn bytes_to_hex(bytes: &[u8; 32]) -> String {
    format!("0x{}", hex::encode(bytes))
}

/// Scan output_objects once and return a map of parent_id → FileRef files.
/// This avoids re-iterating the same object set for each artifact event.
fn build_files_map<'a>(
    output_objects: impl Iterator<Item = &'a sui_types::object::Object>,
) -> HashMap<[u8; 32], Vec<FileInfo>> {
    let mut map: HashMap<[u8; 32], Vec<FileInfo>> = HashMap::new();
    for obj in output_objects {
        let Owner::ObjectOwner(parent_id) = obj.owner() else { continue };
        let Some(move_obj) = obj.as_inner().data.try_as_move() else { continue };
        if !move_obj.type_().is_dynamic_field() { continue };
        let Ok(field) = bcs::from_bytes::<FieldObject<FileRef>>(move_obj.contents()) else { continue };
        if field.name == FILE_REF_DF {
            let key: [u8; 32] = parent_id.as_ref().try_into()
                .expect("SuiAddress is always 32 bytes");
            map.entry(key).or_default().extend(field.value.files);
        }
    }
    map
}

#[async_trait]
impl Processor for ArtifactPipeline {
    const NAME: &'static str = "artifact";
    type Value = ArtifactWithFiles;

    async fn process(&self, checkpoint: &Arc<Checkpoint>) -> anyhow::Result<Vec<Self::Value>> {
        let mut results = Vec::new();

        for tx in &checkpoint.transactions {
            let Some(tx_events) = &tx.events else { continue };

            let artifact_events: Vec<ArtifactEvent> = tx_events
                .data
                .iter()
                .filter(|e| {
                    e.package_id == self.package_id
                        && e.type_.module.as_str() == ARTIFACT_MODULE
                        && e.type_.name.as_str() == ARTIFACT_EVENT_TYPE
                })
                .filter_map(|e| match bcs::from_bytes::<ArtifactEvent>(&e.contents) {
                    Ok(ev) => Some(ev),
                    Err(err) => {
                        tracing::warn!("Failed to deserialize ArtifactEvent: {err}");
                        None
                    }
                })
                .collect();

            if artifact_events.is_empty() {
                continue;
            }

            let mut files_map = build_files_map(tx.output_objects(&checkpoint.object_set));

            for event in artifact_events {
                let files = files_map.remove(&event.id).unwrap_or_default();
                if files.is_empty() && tracing::enabled!(tracing::Level::DEBUG) {
                    tracing::debug!(
                        artifact_id = %bytes_to_hex(&event.id),
                        "No FileRef dynamic field found for artifact"
                    );
                }
                results.push(ArtifactWithFiles { event, files });
            }
        }

        Ok(results)
    }
}

#[async_trait]
impl Handler for ArtifactPipeline {
    type Store = postgres::Db;
    type Batch = Vec<ArtifactWithFiles>;

    fn batch(&self, batch: &mut Self::Batch, values: std::vec::IntoIter<Self::Value>) {
        batch.extend(values);
    }

    async fn commit<'a>(
        &self,
        batch: &Self::Batch,
        conn: &mut postgres::Connection<'a>,
    ) -> anyhow::Result<usize> {
        if batch.is_empty() {
            return Ok(0);
        }

        // Pre-read outside the transaction: used only for version planning.
        // Safe to keep outside because on retry the transaction was rolled back,
        // so no artifacts were actually inserted and db_counts is still accurate.
        // Assumes single indexer process (sequential_pipeline in main.rs guarantees this).
        let distinct_roots: Vec<String> = batch.iter()
            .filter_map(|item| item.event.root_id.as_ref().map(bytes_to_hex))
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        let db_counts: HashMap<String, i64> = if distinct_roots.is_empty() {
            HashMap::new()
        } else {
            artifact_version_counts::table
                .filter(artifact_version_counts::root_id.eq_any(&distinct_roots))
                .select((artifact_version_counts::root_id, artifact_version_counts::version_count))
                .load::<(String, i64)>(&mut *conn)
                .await?
                .into_iter()
                .collect()
        };

        let versions = compute_versions(batch, &db_counts);

        let mut artifact_rows = Vec::with_capacity(batch.len());
        let mut file_rows: Vec<NewArtifactFile> = Vec::with_capacity(batch.len());

        for (item, version) in batch.iter().zip(versions.iter()) {
            let e = &item.event;
            let artifact_id_hex = bytes_to_hex(&e.id);
            let total_size_bytes: i64 = item.files.iter().map(|f| f.size_bytes as i64).sum();

            artifact_rows.push(NewArtifact {
                sui_object_id: artifact_id_hex.clone(),
                root_id: e.root_id.as_ref().map(bytes_to_hex),
                parent_id: e.parent_id.as_ref().map(bytes_to_hex),
                title: e.metadata.title.clone(),
                description: e.metadata.description.clone(),
                version: *version,
                creator: bytes_to_hex(&e.metadata.creator),
                category: e.metadata.category.clone(),
                created_at: e.metadata.created_at as i64,
                total_size_bytes,
            });

            file_rows.extend(item.files.iter().map(|f| NewArtifactFile {
                artifact_id: artifact_id_hex.clone(),
                patch_id: f.patch_id.clone(),
                mime_type: f.mime_type.clone(),
                size_bytes: f.size_bytes as i64,
                name: f.name.clone(),
                hash: f.hash.clone(),
            }));
        }

        let contributor_rows: Vec<NewArtifactContributor> = batch.iter()
            .filter_map(|item| {
                let e = &item.event;
                let contributors = e.contributor.as_ref()?;
                let root = e.root_id.as_ref().map(bytes_to_hex)
                    .unwrap_or_else(|| bytes_to_hex(&e.id));
                Some(contributors.iter().map(move |c| NewArtifactContributor {
                    root_id: root.clone(),
                    creator: bytes_to_hex(&c.creator),
                    role: c.role as i16,
                }))
            })
            .flatten()
            .collect();

        // Up to 3 retries (4 total attempts) on transient serialization failures.
        let mut attempt = 0u32;
        loop {
            // Clone outside the closure so the async move owns the data without
            // fighting the connection's scoped lifetime `'1`.
            let artifact_rows_c = artifact_rows.clone();
            let file_rows_c = file_rows.clone();
            let contributor_rows_c = contributor_rows.clone();
            let result: Result<usize, diesel::result::Error> = conn.transaction(|conn| {
                let artifact_rows = artifact_rows_c;
                let file_rows = file_rows_c;
                let contributor_rows = contributor_rows_c;
                async move {
                    // RETURNING ensures only newly-inserted rows count toward size/version increments.
                    // ON CONFLICT DO NOTHING makes the whole transaction idempotent on checkpoint replay.
                    let inserted_data: Vec<(Option<String>, i64)> =
                        diesel::insert_into(artifact::table)
                            .values(artifact_rows)
                            .on_conflict(artifact::sui_object_id)
                            .do_nothing()
                            .returning((artifact::root_id, artifact::total_size_bytes))
                            .load::<(Option<String>, i64)>(conn)
                            .await?;

                    let inserted_count = inserted_data.len();
                    let inserted_size: i64 = inserted_data.iter().map(|(_, s)| s).sum();

                    let mut version_increments: HashMap<&str, i64> = HashMap::new();
                    for (root_id, _) in inserted_data.iter() {
                        if let Some(root_id) = root_id {
                            *version_increments.entry(root_id.as_str()).or_insert(0) += 1;
                        }
                    }
                    if !version_increments.is_empty() {
                        use diesel::upsert::excluded;
                        let rows: Vec<_> = version_increments
                            .iter()
                            .map(|(root_id, batch_increment)| (
                                artifact_version_counts::root_id.eq(*root_id),
                                artifact_version_counts::version_count.eq(batch_increment),
                            ))
                            .collect();
                        diesel::insert_into(artifact_version_counts::table)
                            .values(&rows)
                            .on_conflict(artifact_version_counts::root_id)
                            .do_update()
                            .set(artifact_version_counts::version_count.eq(
                                artifact_version_counts::version_count
                                    + excluded(artifact_version_counts::version_count)
                            ))
                            .execute(conn)
                            .await?;
                    }

                    if inserted_size > 0 {
                        diesel::update(platform_stats::table.find(1))
                            .set(platform_stats::total_size_bytes.eq(
                                platform_stats::total_size_bytes + inserted_size
                            ))
                            .execute(conn)
                            .await?;
                    }

                    if !file_rows.is_empty() {
                        diesel::insert_into(artifact_file::table)
                            .values(file_rows)
                            .on_conflict((artifact_file::artifact_id, artifact_file::patch_id))
                            .do_nothing()
                            .execute(conn)
                            .await?;
                    }

                    if !contributor_rows.is_empty() {
                        use diesel::upsert::excluded;
                        diesel::insert_into(artifact_contributor::table)
                            .values(contributor_rows)
                            .on_conflict((artifact_contributor::root_id, artifact_contributor::creator))
                            .do_update()
                            .set(artifact_contributor::role.eq(excluded(artifact_contributor::role)))
                            .execute(conn)
                            .await?;
                    }

                    Ok(inserted_count)
                }
                .scope_boxed()
            })
            .await;

            match result {
                Ok(n) => return Ok(n),
                Err(ref e) if attempt < 3 && is_transient_error(e) => {
                    tracing::warn!(attempt, "transient DB error in artifact commit, retrying: {e}");
                    tokio::time::sleep(std::time::Duration::from_millis(50u64 * (1 << attempt))).await;
                    attempt += 1;
                }
                Err(e) => return Err(anyhow::anyhow!(e)),
            }
        }
    }
}

fn compute_versions(batch: &[ArtifactWithFiles], db_counts: &HashMap<String, i64>) -> Vec<i64> {
    let mut batch_counters: HashMap<String, i64> = HashMap::new();
    batch.iter().map(|item| {
        match &item.event.root_id {
            None => 1,
            Some(root_id_bytes) => {
                let hex = bytes_to_hex(root_id_bytes);
                let db_count = db_counts.get(&hex).copied().unwrap_or(0);
                let counter = batch_counters.entry(hex).or_insert(0);
                let version = db_count + *counter + 2;
                *counter += 1;
                version
            }
        }
    }).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_item(id: u8, root_id: Option<u8>) -> ArtifactWithFiles {
        use crate::events::{ArtifactEvent, Metadata};
        ArtifactWithFiles {
            event: ArtifactEvent {
                id: [id; 32],
                root_id: root_id.map(|r| [r; 32]),
                parent_id: None,
                metadata: Metadata {
                    title: String::new(),
                    description: String::new(),
                    version: 0,
                    creator: [0; 32],
                    category: String::new(),
                    created_at: 0,
                },
                contributor: None,
            },
            files: vec![],
        }
    }

    // --- bytes_to_hex ---

    #[test]
    fn bytes_to_hex_all_zeros() {
        assert_eq!(bytes_to_hex(&[0u8; 32]), format!("0x{}", "00".repeat(32)));
    }

    #[test]
    fn bytes_to_hex_all_ff() {
        assert_eq!(bytes_to_hex(&[0xffu8; 32]), format!("0x{}", "ff".repeat(32)));
    }

    #[test]
    fn bytes_to_hex_output_is_always_66_chars() {
        // "0x" prefix + 64 lowercase hex digits
        for b in [0u8, 1, 127, 255] {
            assert_eq!(bytes_to_hex(&[b; 32]).len(), 66);
        }
    }

    #[test]
    fn bytes_to_hex_encodes_leading_and_trailing_bytes() {
        let mut bytes = [0u8; 32];
        bytes[0] = 0xca;
        bytes[31] = 0xfe;
        let h = bytes_to_hex(&bytes);
        assert!(h.starts_with("0xca00"));
        assert!(h.ends_with("fe"));
    }

    // --- compute_versions ---

    #[test]
    fn root_gets_version_one() {
        let batch = vec![make_item(1, None)];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![1]);
    }

    #[test]
    fn first_commit_gets_version_two() {
        let batch = vec![make_item(2, Some(1))];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![2]);
    }

    #[test]
    fn intra_batch_commits_increment() {
        let batch = vec![
            make_item(2, Some(1)),
            make_item(3, Some(1)),
            make_item(4, Some(1)),
        ];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![2, 3, 4]);
    }

    #[test]
    fn db_count_offsets_version() {
        // root(v1) + 4 revisions(v2-v5) = 5 total in lineage; next is v6
        let batch = vec![make_item(2, Some(1))];
        let mut counts = HashMap::new();
        counts.insert(bytes_to_hex(&[1u8; 32]), 4i64);
        let versions = compute_versions(&batch, &counts);
        assert_eq!(versions, vec![6]);
    }

    #[test]
    fn two_roots_tracked_independently() {
        let batch = vec![
            make_item(2, Some(1)),
            make_item(3, Some(2)),
            make_item(4, Some(1)),
        ];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![2, 2, 3]);
    }

    #[test]
    fn empty_batch_yields_empty_versions() {
        assert!(compute_versions(&[], &HashMap::new()).is_empty());
    }

    #[test]
    fn two_independent_roots_in_same_batch_both_get_version_one() {
        let batch = vec![make_item(1, None), make_item(2, None)];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![1, 1]);
    }

    #[test]
    fn root_and_its_commits_in_same_batch() {
        // Root (v1) followed immediately by two commits in the same batch.
        // Commits use root_id=1 (same byte as root's id), so the version counter
        // for that lineage starts at db_count=0, batch_counter=0 → 2, then 3.
        let batch = vec![
            make_item(1, None),    // root → v1
            make_item(2, Some(1)), // first commit → v2
            make_item(3, Some(1)), // second commit → v3
        ];
        let versions = compute_versions(&batch, &HashMap::new());
        assert_eq!(versions, vec![1, 2, 3]);
    }

    // --- build_files_map ---

    #[test]
    fn build_files_map_empty_input_returns_empty_map() {
        let map = build_files_map(std::iter::empty());
        assert!(map.is_empty());
    }

    // --- DB integration tests ---
    // These validate the SQL semantics commit() relies on: ON CONFLICT behaviour,
    // accumulating counters, and upsert correctness.
    //
    // Set TEST_DATABASE_URL to a throwaway Postgres database to run these.
    // They use begin_test_transaction() for automatic rollback on each test.

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
        use diesel_async::AsyncConnection;
        let mut conn = diesel_async::AsyncPgConnection::establish(url)
            .await
            .expect("async TEST_DATABASE_URL connection failed");
        conn.begin_test_transaction().await.expect("begin_test_transaction failed");
        conn
    }

    fn make_artifact_row(id: u8, root_id: Option<u8>) -> crate::db::models::NewArtifact {
        crate::db::models::NewArtifact {
            sui_object_id: bytes_to_hex(&[id; 32]),
            root_id: root_id.map(|r| bytes_to_hex(&[r; 32])),
            parent_id: None,
            title: format!("artifact-{id}"),
            description: "test".to_string(),
            version: if root_id.is_some() { 2 } else { 1 },
            creator: bytes_to_hex(&[id; 32]),
            category: "test".to_string(),
            created_at: 0,
            total_size_bytes: 0,
        }
    }

    #[tokio::test]
    async fn artifact_on_conflict_do_nothing_is_idempotent() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use diesel_async::RunQueryDsl;

        let row = make_artifact_row(0xA1, None);

        // First insert returns the row via RETURNING
        let first: Vec<String> = diesel::insert_into(artifact::table)
            .values(&row)
            .on_conflict(artifact::sui_object_id)
            .do_nothing()
            .returning(artifact::sui_object_id)
            .load(&mut conn).await.unwrap();
        assert_eq!(first.len(), 1);

        // Duplicate insert must be silently ignored (DO NOTHING)
        let second: Vec<String> = diesel::insert_into(artifact::table)
            .values(&row)
            .on_conflict(artifact::sui_object_id)
            .do_nothing()
            .returning(artifact::sui_object_id)
            .load(&mut conn).await.unwrap();
        assert!(second.is_empty(), "duplicate artifact must not be re-inserted");
    }

    #[tokio::test]
    async fn version_count_upsert_accumulates() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use diesel::upsert::excluded;
        use diesel_async::RunQueryDsl;

        let root = "0x_test_vc_acc";

        // Insert initial count of 1
        diesel::insert_into(artifact_version_counts::table)
            .values((
                artifact_version_counts::root_id.eq(root),
                artifact_version_counts::version_count.eq(1i64),
            ))
            .on_conflict(artifact_version_counts::root_id)
            .do_update()
            .set(artifact_version_counts::version_count.eq(
                artifact_version_counts::version_count + excluded(artifact_version_counts::version_count),
            ))
            .execute(&mut conn).await.unwrap();

        // Second upsert adds 2 more
        diesel::insert_into(artifact_version_counts::table)
            .values((
                artifact_version_counts::root_id.eq(root),
                artifact_version_counts::version_count.eq(2i64),
            ))
            .on_conflict(artifact_version_counts::root_id)
            .do_update()
            .set(artifact_version_counts::version_count.eq(
                artifact_version_counts::version_count + excluded(artifact_version_counts::version_count),
            ))
            .execute(&mut conn).await.unwrap();

        let count: i64 = artifact_version_counts::table
            .filter(artifact_version_counts::root_id.eq(root))
            .select(artifact_version_counts::version_count)
            .first(&mut conn).await.unwrap();

        assert_eq!(count, 3);
    }

    #[tokio::test]
    async fn platform_stats_total_size_accumulates() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use diesel_async::RunQueryDsl;

        let before: i64 = platform_stats::table
            .find(1)
            .select(platform_stats::total_size_bytes)
            .first(&mut conn).await.unwrap();

        diesel::update(platform_stats::table.find(1))
            .set(platform_stats::total_size_bytes.eq(
                platform_stats::total_size_bytes + 1_000_000i64,
            ))
            .execute(&mut conn).await.unwrap();

        let after: i64 = platform_stats::table
            .find(1)
            .select(platform_stats::total_size_bytes)
            .first(&mut conn).await.unwrap();

        assert_eq!(after - before, 1_000_000);
    }

    #[tokio::test]
    async fn contributor_upsert_updates_role_and_deduplicates() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use diesel::upsert::excluded;
        use diesel_async::RunQueryDsl;

        let root = "0x_test_contrib_upsert";
        let creator = "0x_test_creator_upsert";

        let insert = |role: i16| {
            crate::db::models::NewArtifactContributor {
                root_id: root.to_string(),
                creator: creator.to_string(),
                role,
            }
        };

        // Insert with role 0
        diesel::insert_into(artifact_contributor::table)
            .values(&insert(0))
            .on_conflict((artifact_contributor::root_id, artifact_contributor::creator))
            .do_update()
            .set(artifact_contributor::role.eq(excluded(artifact_contributor::role)))
            .execute(&mut conn).await.unwrap();

        // Upsert with role 1 — must update, not duplicate
        diesel::insert_into(artifact_contributor::table)
            .values(&insert(1))
            .on_conflict((artifact_contributor::root_id, artifact_contributor::creator))
            .do_update()
            .set(artifact_contributor::role.eq(excluded(artifact_contributor::role)))
            .execute(&mut conn).await.unwrap();

        let role: i16 = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(root))
            .filter(artifact_contributor::creator.eq(creator))
            .select(artifact_contributor::role)
            .first(&mut conn).await.unwrap();
        assert_eq!(role, 1);

        let row_count: i64 = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq(root))
            .count()
            .get_result(&mut conn).await.unwrap();
        assert_eq!(row_count, 1, "upsert must not create duplicate contributor rows");
    }

    #[tokio::test]
    async fn artifact_file_on_conflict_do_nothing_deduplicates() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use diesel_async::RunQueryDsl;

        // artifact_file has a FK to artifact, so seed the parent row first
        let art = make_artifact_row(0xC1, None);
        diesel::insert_into(artifact::table)
            .values(&art)
            .execute(&mut conn).await.unwrap();

        let file = crate::db::models::NewArtifactFile {
            artifact_id: bytes_to_hex(&[0xC1u8; 32]),
            patch_id: "patch-c1".to_string(),
            mime_type: "text/plain".to_string(),
            size_bytes: 512,
            name: "file.txt".to_string(),
            hash: "abc123".to_string(),
        };

        diesel::insert_into(artifact_file::table)
            .values(&file)
            .on_conflict((artifact_file::artifact_id, artifact_file::patch_id))
            .do_nothing()
            .execute(&mut conn).await.unwrap();

        // Second identical insert must be ignored
        diesel::insert_into(artifact_file::table)
            .values(&file)
            .on_conflict((artifact_file::artifact_id, artifact_file::patch_id))
            .do_nothing()
            .execute(&mut conn).await.unwrap();

        let count: i64 = artifact_file::table
            .filter(artifact_file::artifact_id.eq(bytes_to_hex(&[0xC1u8; 32])))
            .count()
            .get_result(&mut conn).await.unwrap();
        assert_eq!(count, 1, "duplicate file must not be inserted");
    }

    #[tokio::test]
    async fn artifact_stats_on_conflict_increments_view_count() {
        let Some(url) = test_db_url() else { return };
        ensure_migrated(&url);
        let mut conn = open_test_conn(&url).await;

        use archive_db::artifact_stats;
        use diesel_async::RunQueryDsl;

        let root = "0x_test_stats_view";

        let inc_view = || {
            diesel::insert_into(artifact_stats::table)
                .values((
                    artifact_stats::root_id.eq(root),
                    artifact_stats::view_count.eq(1i64),
                ))
                .on_conflict(artifact_stats::root_id)
                .do_update()
                .set(artifact_stats::view_count.eq(artifact_stats::view_count + 1i64))
        };

        inc_view().execute(&mut conn).await.unwrap();
        inc_view().execute(&mut conn).await.unwrap();

        let count: i64 = artifact_stats::table
            .filter(artifact_stats::root_id.eq(root))
            .select(artifact_stats::view_count)
            .first(&mut conn).await.unwrap();
        assert_eq!(count, 2);
    }
}
