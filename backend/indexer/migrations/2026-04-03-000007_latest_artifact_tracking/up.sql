ALTER TABLE artifact_version_counts ADD COLUMN latest_artifact_id TEXT REFERENCES artifact(sui_object_id);

-- Backfill: for each root that has children, point to the highest-version child.
UPDATE artifact_version_counts vc
SET latest_artifact_id = (
    SELECT a.sui_object_id
    FROM artifact a
    WHERE a.root_id = vc.root_id
    ORDER BY a.version DESC
    LIMIT 1
);
