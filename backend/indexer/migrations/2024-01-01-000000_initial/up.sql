CREATE TABLE artifact (
    sui_object_id   TEXT     PRIMARY KEY,
    owner           TEXT     NOT NULL,
    title           TEXT     NOT NULL,
    description     TEXT     NOT NULL,
    topics          TEXT[]   NOT NULL,
    categories      TEXT[]   NOT NULL DEFAULT '{}',
    authors         JSONB    NOT NULL DEFAULT '[]',
    institution     TEXT     NOT NULL,
    published_date  DATE     NOT NULL,
    license         TEXT     NOT NULL,
    tags            TEXT[]   NOT NULL,
    revision_of     TEXT,
    created_epoch   BIGINT   NOT NULL,
    updated_epoch   BIGINT   NOT NULL,
    file_count      INT      NOT NULL DEFAULT 0
);

CREATE INDEX ON artifact USING GIN(topics);
CREATE INDEX ON artifact USING GIN(categories);
CREATE INDEX ON artifact(created_epoch DESC);
CREATE INDEX ON artifact(published_date DESC);
CREATE INDEX ON artifact(revision_of);
CREATE INDEX ON artifact USING GIN(
    to_tsvector('english', title || ' ' || institution || ' ' || description)
);
