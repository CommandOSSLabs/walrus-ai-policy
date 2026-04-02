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

-- FK: NOT VALID skips checking existing rows (some contributor events arrive before
-- their artifact event, leaving orphaned rows in the derived cache). Future inserts
-- from the indexer will still be validated.
ALTER TABLE artifact_contributor
    ADD CONSTRAINT fk_artifact_contributor_root
    FOREIGN KEY (root_id) REFERENCES artifact(sui_object_id) NOT VALID;

-- FK: NOT VALID for the same reason — increment_view could race indexer lag.
ALTER TABLE artifact_viewer
    ADD CONSTRAINT fk_artifact_viewer_root
    FOREIGN KEY (root_id) REFERENCES artifact(sui_object_id) NOT VALID;
