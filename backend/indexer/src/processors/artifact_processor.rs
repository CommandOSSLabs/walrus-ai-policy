use std::collections::HashMap;
use std::sync::Arc;

use async_trait::async_trait;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use sui_indexer_alt_framework::pipeline::Processor;
use sui_indexer_alt_framework::pipeline::sequential::Handler;
use sui_indexer_alt_framework::postgres;
use sui_indexer_alt_framework::types::full_checkpoint_content::Checkpoint;
use sui_types::base_types::ObjectID;
use sui_types::object::Owner;

use crate::db::models::{NewArtifact, NewArtifactFile};
use crate::db::schema::{artifact, artifact_file, artifact_version_counts};
use crate::events::{ArtifactEvent, FieldObject, FileRef, FileInfo};

const FILE_REF_DF: u8 = 1;
const ARTIFACT_MODULE: &str = "artifact";
const ARTIFACT_EVENT_TYPE: &str = "ArtifactEvent";

pub struct ArtifactPipeline {
    pub package_id: ObjectID,
}

pub struct ArtifactWithFiles {
    pub event: ArtifactEvent,
    pub files: Vec<FileInfo>,
}

fn bytes_to_hex(bytes: &[u8; 32]) -> String {
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

            for artifact_event in artifact_events {
                let files = files_map.remove(&artifact_event.id).unwrap_or_default();
                if files.is_empty() && tracing::enabled!(tracing::Level::DEBUG) {
                    tracing::debug!(
                        artifact_id = %bytes_to_hex(&artifact_event.id),
                        "No FileRef dynamic field found for artifact"
                    );
                }
                results.push(ArtifactWithFiles { event: artifact_event, files });
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

        let distinct_roots: Vec<String> = batch.iter()
            .filter_map(|item| item.event.root_id.as_ref().map(bytes_to_hex))
            .collect::<std::collections::HashSet<_>>()
            .into_iter()
            .collect();

        // O(1) per root lookup instead of GROUP BY COUNT scan on the artifact table.
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
                file_name: f.file_name.clone(),
            }));
        }

        // RETURNING lets us know which rows were actually inserted vs skipped by
        // ON CONFLICT DO NOTHING, so version counter updates stay idempotent on replay.
        let inserted_roots: Vec<Option<String>> = diesel::insert_into(artifact::table)
            .values(&artifact_rows)
            .on_conflict(artifact::sui_object_id)
            .do_nothing()
            .returning(artifact::root_id)
            .load::<Option<String>>(conn)
            .await?;

        let inserted_count = inserted_roots.len();

        let mut version_increments: HashMap<&str, i64> = HashMap::new();
        for root_id in inserted_roots.iter().flatten() {
            *version_increments.entry(root_id.as_str()).or_insert(0) += 1;
        }
        if !version_increments.is_empty() {
            use diesel::upsert::excluded;
            let rows: Vec<_> = version_increments
                .iter()
                .map(|(root_id, count)| (
                    artifact_version_counts::root_id.eq(*root_id),
                    artifact_version_counts::version_count.eq(count),
                ))
                .collect();
            diesel::insert_into(artifact_version_counts::table)
                .values(&rows)
                .on_conflict(artifact_version_counts::root_id)
                .do_update()
                .set(artifact_version_counts::version_count.eq(
                    artifact_version_counts::version_count + excluded(artifact_version_counts::version_count)
                ))
                .execute(conn)
                .await?;
        }

        if !file_rows.is_empty() {
            diesel::insert_into(artifact_file::table)
                .values(&file_rows)
                .on_conflict((artifact_file::artifact_id, artifact_file::patch_id))
                .do_nothing()
                .execute(conn)
                .await?;
        }

        Ok(inserted_count)
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
}
