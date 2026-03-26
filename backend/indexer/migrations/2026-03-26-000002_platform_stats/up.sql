-- Global platform storage counter. Single row, updated at artifact insert time.
CREATE TABLE platform_stats (
    id               INTEGER PRIMARY KEY DEFAULT 1,
    total_size_bytes BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO platform_stats (id, total_size_bytes) VALUES (1, 0);
