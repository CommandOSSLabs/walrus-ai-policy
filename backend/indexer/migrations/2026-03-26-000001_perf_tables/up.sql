-- Per-root version counter. Replaces GROUP BY COUNT scan for version numbering.
CREATE TABLE artifact_version_counts (
    root_id       TEXT   PRIMARY KEY,
    version_count BIGINT NOT NULL DEFAULT 0
);

ALTER TABLE artifact ADD COLUMN total_size_bytes BIGINT NOT NULL DEFAULT 0;
ALTER TABLE artifact_file ADD COLUMN file_name TEXT;
