use std::collections::HashMap;

use async_graphql::dataloader::Loader;
use diesel::prelude::*;
use diesel_async::RunQueryDsl;

use archive_db::artifact;
use archive_db::artifact_contributor;
use archive_db::artifact_stats;
use crate::db::DbPool;
use crate::schema::{StoredArtifact, StoredArtifactStats, StoredContributor};

fn db_err(e: impl ToString) -> async_graphql::Error {
    async_graphql::Error::new(e.to_string())
}

// ---------------------------------------------------------------------------
// ContributorsLoader — batch-loads all contributors for a set of root_ids
// ---------------------------------------------------------------------------

pub struct ContributorsLoader {
    pub pool: DbPool,
}

impl Loader<String> for ContributorsLoader {
    type Value = Vec<StoredContributor>;
    type Error = async_graphql::Error;

    async fn load(&self, keys: &[String]) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let mut conn = self.pool.get().await.map_err(db_err)?;

        let rows: Vec<(String, String, i16)> = artifact_contributor::table
            .filter(artifact_contributor::root_id.eq_any(keys))
            .select((
                artifact_contributor::root_id,
                artifact_contributor::creator,
                artifact_contributor::role,
            ))
            .load(&mut conn)
            .await
            .map_err(db_err)?;

        let mut map: HashMap<String, Vec<StoredContributor>> = HashMap::new();
        for (root_id, creator, role) in rows {
            map.entry(root_id).or_default().push(StoredContributor { creator, role });
        }
        Ok(map)
    }
}

// ---------------------------------------------------------------------------
// VersionsLoader — batch-loads all versions for a set of root_ids
// Root artifacts: sui_object_id = key, root_id IS NULL.
// Commits: root_id = key.
// ---------------------------------------------------------------------------

pub struct VersionsLoader {
    pub pool: DbPool,
}

impl Loader<String> for VersionsLoader {
    type Value = Vec<StoredArtifact>;
    type Error = async_graphql::Error;

    async fn load(&self, keys: &[String]) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let mut conn = self.pool.get().await.map_err(db_err)?;

        let rows: Vec<StoredArtifact> = artifact::table
            .filter(
                // Root artifacts match by sui_object_id (root_id IS NULL).
                // Commits match by root_id. Scoping roots to root_id IS NULL
                // prevents a commit's sui_object_id from matching a root key.
                artifact::sui_object_id.eq_any(keys).and(artifact::root_id.is_null())
                    .or(artifact::root_id.eq_any(keys))
            )
            .select(artifact::all_columns)
            .order(artifact::version.desc())
            .load(&mut conn)
            .await
            .map_err(db_err)?;

        let mut map: HashMap<String, Vec<StoredArtifact>> = HashMap::new();
        for artifact in rows {
            // Normalize to root key: COALESCE(root_id, sui_object_id)
            let key = artifact.root_id.clone().unwrap_or_else(|| artifact.sui_object_id.clone());
            map.entry(key).or_default().push(artifact);
        }
        Ok(map)
    }
}

// ---------------------------------------------------------------------------
// StatsLoader — batch-loads view/download stats for a set of root_ids
// ---------------------------------------------------------------------------

pub struct StatsLoader {
    pub pool: DbPool,
}

impl Loader<String> for StatsLoader {
    type Value = StoredArtifactStats;
    type Error = async_graphql::Error;

    async fn load(&self, keys: &[String]) -> Result<HashMap<String, Self::Value>, Self::Error> {
        let mut conn = self.pool.get().await.map_err(db_err)?;

        let rows: Vec<(String, i64, i64)> = artifact_stats::table
            .filter(artifact_stats::root_id.eq_any(keys))
            .select((
                artifact_stats::root_id,
                artifact_stats::view_count,
                artifact_stats::download_count,
            ))
            .load(&mut conn)
            .await
            .map_err(db_err)?;

        let mut map: HashMap<String, StoredArtifactStats> = HashMap::new();
        for (root_id, view_count, download_count) in rows {
            map.insert(root_id, StoredArtifactStats { view_count, download_count });
        }
        // Insert zero-stats for any key not in artifact_stats so the DataLoader
        // caches the miss and avoids a repeat DB query.
        for key in keys {
            map.entry(key.clone()).or_insert(StoredArtifactStats { view_count: 0, download_count: 0 });
        }
        Ok(map)
    }
}
