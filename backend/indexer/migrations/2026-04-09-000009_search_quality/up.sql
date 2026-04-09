-- GIN index for O(1) tag filtering (was a sequential scan)
CREATE INDEX IF NOT EXISTS artifact_ai_meta_tags_gin ON artifact_ai_meta USING GIN(tags);

-- Pre-computed tsvector: summary + tags from AI processing.
-- The artifact table already GIN-indexes title+description (migration 000000).
-- This column lets FTS match on summary/tags without recomputing tsvector at query time.
ALTER TABLE artifact_ai_meta ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;
CREATE INDEX IF NOT EXISTS artifact_ai_meta_search_vector_gin ON artifact_ai_meta USING GIN(search_vector);

-- Backfill rows that are already processed
UPDATE artifact_ai_meta
SET search_vector = to_tsvector(
    'english',
    COALESCE(summary, '') || ' ' || array_to_string(tags, ' ')
)
WHERE status = 'done';
