DROP TABLE IF EXISTS artifact_embedding;
DROP TABLE IF EXISTS artifact_ai_meta;
-- Intentionally not dropping the vector extension: it is a shared cluster resource.
-- Remove manually if pgvector is no longer needed by any table in this database.
