CREATE TABLE tours (
    id             BIGSERIAL    PRIMARY KEY,
    slug           VARCHAR(255) NOT NULL UNIQUE,
    title          VARCHAR(255) NOT NULL,
    tour_type      VARCHAR(30)  NOT NULL,
    difficulty     VARCHAR(10)  NOT NULL,
    region_id      BIGINT       REFERENCES regions(id) ON DELETE SET NULL,
    summary        TEXT,
    description    TEXT,
    elevation_up   INTEGER,
    elevation_down INTEGER,
    distance_km    NUMERIC(6, 2),
    duration_min   INTEGER,
    start_location VARCHAR(255),
    end_location   VARCHAR(255),
    best_season    VARCHAR(100),
    tour_date      DATE,
    published      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX tours_tour_type_idx  ON tours (tour_type);
CREATE INDEX tours_difficulty_idx ON tours (difficulty);
CREATE INDEX tours_region_idx     ON tours (region_id);
CREATE INDEX tours_published_idx  ON tours (published);
