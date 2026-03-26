-- Single-row stats table; counters maintained at write time by the indexer.
-- Avoids COUNT(*)/GROUP BY scans on live endpoints.
CREATE TABLE network_stats (
    id                BOOLEAN PRIMARY KEY DEFAULT TRUE,
    total_size_bytes  BIGINT NOT NULL DEFAULT 0,
    artifact_count    BIGINT NOT NULL DEFAULT 0,
    root_count        BIGINT NOT NULL DEFAULT 0,
    contributor_count BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT single_row CHECK (id = TRUE)
);

-- LOAD-BEARING: this row must always exist. The GraphQL resolver uses get_result()
-- which returns an error if the table is empty. Any migration that truncates this
-- table must also re-insert this row.
INSERT INTO network_stats (total_size_bytes) VALUES (0);

-- Deduplicated creator addresses.
CREATE TABLE contributors (
    creator TEXT PRIMARY KEY
);

-- Per-root version counter. Replaces GROUP BY COUNT scan for version numbering.
CREATE TABLE artifact_version_counts (
    root_id       TEXT   PRIMARY KEY,
    version_count BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE artifact_file ADD COLUMN file_name TEXT;
