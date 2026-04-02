ALTER TABLE artifact_viewer DROP CONSTRAINT IF EXISTS fk_artifact_viewer_root;
ALTER TABLE artifact_contributor DROP CONSTRAINT IF EXISTS fk_artifact_contributor_root;
DROP INDEX IF EXISTS artifact_root_id_version_idx;
DROP TABLE artifact_viewer;
