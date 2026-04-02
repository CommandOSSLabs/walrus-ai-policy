CREATE TABLE artifact_viewer (
    root_id        TEXT NOT NULL,
    viewer_address TEXT NOT NULL,
    PRIMARY KEY (root_id, viewer_address)
);

-- Composite index: versions() resolver filters on root_id then sorts by version.
-- Without this, Postgres must sort in memory for large version histories.
-- Note: CREATE INDEX CONCURRENTLY cannot run inside a transaction.
-- Diesel wraps migrations in transactions, so we use a regular CREATE INDEX.
-- This acquires ACCESS EXCLUSIVE briefly; acceptable for this rebuildable cache.
CREATE INDEX artifact_root_id_version_idx ON artifact(root_id, version);

-- FK: indexer controls artifact_contributor inserts, so root_id always refers to a real artifact.
ALTER TABLE artifact_contributor
    ADD CONSTRAINT fk_artifact_contributor_root
    FOREIGN KEY (root_id) REFERENCES artifact(sui_object_id);

-- FK: artifact_viewer root_id must refer to an existing artifact. The GraphQL
-- increment_view mutation only fires after the frontend loads an artifact (which
-- requires it to already be in the DB), so this constraint holds in practice.
-- Risk: a race between GraphQL write and indexer lag would cause a FK violation.
ALTER TABLE artifact_viewer
    ADD CONSTRAINT fk_artifact_viewer_root
    FOREIGN KEY (root_id) REFERENCES artifact(sui_object_id);
