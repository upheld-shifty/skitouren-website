CREATE TABLE gpx_files (
    id            BIGSERIAL    PRIMARY KEY,
    tour_id       BIGINT       NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    filename      VARCHAR(255) NOT NULL,
    original_name VARCHAR(255),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    CONSTRAINT gpx_one_per_tour UNIQUE (tour_id)
);
