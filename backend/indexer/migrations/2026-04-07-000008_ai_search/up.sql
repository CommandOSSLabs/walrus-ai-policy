-- backend/indexer/migrations/2026-04-07-000008_ai_search/up.sql

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE artifact_ai_meta (
    artifact_id  TEXT PRIMARY KEY REFERENCES artifact(sui_object_id),
    summary      TEXT,
    tags         TEXT[]   NOT NULL DEFAULT '{}',
    status       TEXT     NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'processing', 'done', 'failed', 'permanently_failed')),
    retry_count  SMALLINT NOT NULL DEFAULT 0,
    created_at   BIGINT   NOT NULL,
    processed_at BIGINT,
    updated_at   BIGINT   NOT NULL
);

CREATE INDEX artifact_ai_meta_status_idx ON artifact_ai_meta (status, retry_count, created_at);

CREATE TABLE artifact_embedding (
    artifact_id TEXT PRIMARY KEY REFERENCES artifact(sui_object_id),
    embedding   vector(512) NOT NULL
    -- text-embedding-3-small with dimensions=512
);

CREATE INDEX ON artifact_embedding USING hnsw (embedding vector_cosine_ops);
