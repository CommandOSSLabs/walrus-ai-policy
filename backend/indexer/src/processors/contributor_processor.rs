use std::sync::Arc;

use async_trait::async_trait;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use sui_indexer_alt_framework::pipeline::Processor;
use sui_indexer_alt_framework::pipeline::sequential::Handler;
use sui_indexer_alt_framework::postgres;
use sui_indexer_alt_framework::types::full_checkpoint_content::Checkpoint;
use sui_types::base_types::ObjectID;

use crate::db::models::NewArtifactContributor;
use crate::db::schema::artifact_contributor;
use crate::events::ContributorEvent;
use super::bytes_to_hex;

const CONTRIBUTOR_MODULE: &str = "contributor";
const CONTRIBUTOR_EVENT_TYPE: &str = "ContributorEvent";

pub struct ContributorPipeline {
    pub package_id: ObjectID,
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

        if !upserts.is_empty() {
            use diesel::upsert::excluded;
            diesel::insert_into(artifact_contributor::table)
                .values(&upserts)
                .on_conflict((artifact_contributor::root_id, artifact_contributor::creator))
                .do_update()
                .set(artifact_contributor::role.eq(excluded(artifact_contributor::role)))
                .execute(conn)
                .await?;
        }

        let to_delete: Vec<(String, String)> = batch.iter()
            .filter(|ev| ev.role.is_none())
            .map(|ev| (bytes_to_hex(&ev.root_id), bytes_to_hex(&ev.creator)))
            .collect();

        if !to_delete.is_empty() {
            diesel::delete(artifact_contributor::table)
                .filter(
                    (artifact_contributor::root_id, artifact_contributor::creator)
                        .eq_any(to_delete)
                )
                .execute(conn)
                .await?;
        }

        Ok(batch.len())
    }
}
