use std::collections::HashMap;
use std::sync::Arc;

use async_trait::async_trait;
use diesel_async::RunQueryDsl;
use sui_indexer_alt_framework::pipeline::Processor;
use sui_indexer_alt_framework::pipeline::sequential::Handler;
use sui_indexer_alt_framework::postgres;
use sui_indexer_alt_framework::types::full_checkpoint_content::Checkpoint;
use sui_types::base_types::ObjectID;
use sui_types::object::Owner;

use crate::db::models::{NewArtifact, NewArtifactFile};
use crate::db::schema::{artifact, artifact_file};
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

        let mut artifact_rows = Vec::with_capacity(batch.len());
        let mut file_rows: Vec<NewArtifactFile> = Vec::with_capacity(batch.len());

        for item in batch {
            let e = &item.event;
            let artifact_id_hex = bytes_to_hex(&e.id);

            artifact_rows.push(NewArtifact {
                sui_object_id: artifact_id_hex.clone(),
                root_id: e.root_id.as_ref().map(bytes_to_hex),
                parent_id: e.parent_id.as_ref().map(bytes_to_hex),
                title: e.metadata.title.clone(),
                description: e.metadata.description.clone(),
                version: e.metadata.version as i64,
                creator: bytes_to_hex(&e.metadata.creator),
                category: e.metadata.category.clone(),
                created_at: e.metadata.created_at as i64,
            });

            file_rows.extend(item.files.iter().map(|f| NewArtifactFile {
                artifact_id: artifact_id_hex.clone(),
                patch_id: f.patch_id.clone(),
                mime_type: f.mime_type.clone(),
                size_bytes: f.size_bytes as i64,
            }));
        }

        let affected = diesel::insert_into(artifact::table)
            .values(&artifact_rows)
            .on_conflict(artifact::sui_object_id)
            .do_nothing()
            .execute(conn)
            .await?;

        if !file_rows.is_empty() {
            diesel::insert_into(artifact_file::table)
                .values(&file_rows)
                .on_conflict((artifact_file::artifact_id, artifact_file::patch_id))
                .do_nothing()
                .execute(conn)
                .await?;
        }

        Ok(affected)
    }
}
