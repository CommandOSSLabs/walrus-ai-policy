CREATE TABLE artifact_contributor (
    root_id TEXT     NOT NULL,
    creator TEXT     NOT NULL,
    role    SMALLINT NOT NULL,
    PRIMARY KEY (root_id, creator)
);

CREATE INDEX ON artifact_contributor(root_id);
