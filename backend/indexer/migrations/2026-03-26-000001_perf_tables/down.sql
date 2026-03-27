ALTER TABLE artifact_file DROP COLUMN name;
ALTER TABLE artifact DROP COLUMN total_size_bytes;
DROP TABLE IF EXISTS artifact_version_counts;
