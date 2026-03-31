-- Off-chain view/download counters per artifact tree. Not rebuilt from chain events.
CREATE TABLE artifact_stats (
    root_id        TEXT   PRIMARY KEY,
    view_count     BIGINT NOT NULL DEFAULT 0,
    download_count BIGINT NOT NULL DEFAULT 0
);
