CREATE TABLE artifact (
    sui_object_id TEXT    PRIMARY KEY,
    root_id       TEXT,
    parent_id     TEXT,
    title         TEXT    NOT NULL,
    description   TEXT    NOT NULL,
    version       BIGINT  NOT NULL DEFAULT 0,
    creator       TEXT    NOT NULL,
    category      TEXT    NOT NULL,
    created_at    BIGINT  NOT NULL
);

CREATE INDEX ON artifact(root_id);
CREATE INDEX ON artifact(parent_id);
CREATE INDEX ON artifact(creator);
CREATE INDEX ON artifact(created_at DESC);
CREATE INDEX ON artifact(category);
CREATE INDEX ON artifact USING GIN(
    to_tsvector('english', title || ' ' || description)
);

CREATE TABLE artifact_file (
    id           BIGSERIAL PRIMARY KEY,
    artifact_id  TEXT      NOT NULL REFERENCES artifact(sui_object_id),
    patch_id     TEXT      NOT NULL,
    mime_type    TEXT      NOT NULL,
    size_bytes   BIGINT    NOT NULL,
    UNIQUE (artifact_id, patch_id)
);

CREATE INDEX ON artifact_file(artifact_id);
