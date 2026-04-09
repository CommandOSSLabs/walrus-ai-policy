DROP INDEX IF EXISTS artifact_ai_meta_search_vector_gin;
DROP INDEX IF EXISTS artifact_ai_meta_tags_gin;
ALTER TABLE artifact_ai_meta DROP COLUMN IF EXISTS search_vector;
