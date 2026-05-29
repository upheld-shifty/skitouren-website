CREATE TABLE photos (
    id            BIGSERIAL    PRIMARY KEY,
    tour_id       BIGINT       NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    filename      VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    caption       VARCHAR(500),
    sort_order    INTEGER      NOT NULL DEFAULT 0,
    is_cover      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX photos_tour_idx ON photos (tour_id);
