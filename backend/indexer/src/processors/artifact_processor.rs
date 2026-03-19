use std::sync::Arc;

use async_trait::async_trait;
use chrono::NaiveDate;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;
use sui_indexer_alt_framework::pipeline::Processor;
use sui_indexer_alt_framework::pipeline::sequential::Handler;
use sui_indexer_alt_framework::postgres;
use sui_indexer_alt_framework::types::full_checkpoint_content::Checkpoint;

use crate::db::models::NewArtifact;
use crate::db::schema::artifact;
use crate::events::{
    ArtifactCreatedEvent, ArtifactEvent, ArtifactUpdatedEvent, FileRemovedEvent, FileUpsertedEvent,
};

pub struct ArtifactPipeline {
    pub package_id: String,
}

#[async_trait]
impl Processor for ArtifactPipeline {
    const NAME: &'static str = "artifact";
    type Value = ArtifactEvent;

    async fn process(&self, checkpoint: &Arc<Checkpoint>) -> anyhow::Result<Vec<Self::Value>> {
        let mut events = Vec::new();

        for tx in &checkpoint.transactions {
            let Some(tx_events) = &tx.events else {
                continue;
            };

            for event in &tx_events.data {
                if event.package_id.to_string() != self.package_id
                    || event.type_.module.as_str() != "artifact"
                {
                    continue;
                }

                let parsed = match event.type_.name.as_str() {
                    "ArtifactCreated" => match bcs::from_bytes::<ArtifactCreatedEvent>(&event.contents) {
                        Ok(e) => ArtifactEvent::Created(e),
                        Err(err) => {
                            tracing::warn!("Failed to deserialize ArtifactCreated: {err}");
                            continue;
                        }
                    },
                    "ArtifactUpdated" => match bcs::from_bytes::<ArtifactUpdatedEvent>(&event.contents) {
                        Ok(e) => ArtifactEvent::Updated(e),
                        Err(err) => {
                            tracing::warn!("Failed to deserialize ArtifactUpdated: {err}");
                            continue;
                        }
                    },
                    "FileUpserted" => match bcs::from_bytes::<FileUpsertedEvent>(&event.contents) {
                        Ok(e) => ArtifactEvent::FileUpserted(e),
                        Err(err) => {
                            tracing::warn!("Failed to deserialize FileUpserted: {err}");
                            continue;
                        }
                    },
                    "FileRemoved" => match bcs::from_bytes::<FileRemovedEvent>(&event.contents) {
                        Ok(e) => ArtifactEvent::FileRemoved(e),
                        Err(err) => {
                            tracing::warn!("Failed to deserialize FileRemoved: {err}");
                            continue;
                        }
                    },
                    _ => continue,
                };

                events.push(parsed);
            }
        }

        Ok(events)
    }
}

#[async_trait]
impl Handler for ArtifactPipeline {
    type Store = postgres::Db;
    type Batch = Vec<ArtifactEvent>;

    fn batch(&self, batch: &mut Self::Batch, values: std::vec::IntoIter<Self::Value>) {
        batch.extend(values);
    }

    async fn commit<'a>(
        &self,
        batch: &Self::Batch,
        conn: &mut postgres::Connection<'a>,
    ) -> anyhow::Result<usize> {
        let mut affected = 0;

        for event in batch {
            match event {
                ArtifactEvent::Created(e) => {
                    let published_date = match NaiveDate::parse_from_str(&e.published_date, "%Y-%m-%d") {
                        Ok(d) => d,
                        Err(err) => {
                            tracing::warn!(
                                sui_object_id = %e.sui_object_id,
                                published_date = %e.published_date,
                                "Invalid published_date, skipping artifact: {err}"
                            );
                            continue;
                        }
                    };

                    let row = NewArtifact {
                        sui_object_id: e.sui_object_id.clone(),
                        owner: e.owner.clone(),
                        title: e.title.clone(),
                        description: e.description.clone(),
                        topics: e.topics.clone(),
                        categories: e.categories.clone(),
                        authors: serde_json::to_value(&e.authors)?,
                        institution: e.institution.clone(),
                        published_date,
                        license: e.license.clone(),
                        tags: e.tags.clone(),
                        revision_of: e.revision_of.clone(),
                        created_epoch: e.created_epoch as i64,
                        updated_epoch: e.created_epoch as i64,
                        file_count: 0,
                    };
                    affected += diesel::insert_into(artifact::table)
                        .values(&row)
                        .on_conflict_do_nothing()
                        .execute(conn)
                        .await?;
                }

                ArtifactEvent::Updated(e) => {
                    affected += diesel::update(
                        artifact::table.filter(artifact::sui_object_id.eq(&e.sui_object_id)),
                    )
                    .set((
                        artifact::title.eq(&e.title),
                        artifact::description.eq(&e.description),
                        artifact::topics.eq(&e.topics),
                        artifact::categories.eq(&e.categories),
                        artifact::authors.eq(serde_json::to_value(&e.authors)?),
                        artifact::tags.eq(&e.tags),
                        artifact::updated_epoch.eq(e.updated_epoch as i64),
                    ))
                    .execute(conn)
                    .await?;
                }

                ArtifactEvent::FileUpserted(e) => {
                    affected += diesel::update(
                        artifact::table.filter(artifact::sui_object_id.eq(&e.sui_object_id)),
                    )
                    .set(artifact::file_count.eq(artifact::file_count + 1))
                    .execute(conn)
                    .await?;
                }

                ArtifactEvent::FileRemoved(e) => {
                    affected += diesel::update(
                        artifact::table.filter(artifact::sui_object_id.eq(&e.sui_object_id)),
                    )
                    .set(artifact::file_count.eq(diesel::dsl::sql("GREATEST(file_count - 1, 0)")))
                    .execute(conn)
                    .await?;
                }
            }
        }

        Ok(affected)
    }
}
