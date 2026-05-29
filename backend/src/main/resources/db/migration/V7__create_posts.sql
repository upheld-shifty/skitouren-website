CREATE TABLE posts (
    id          BIGSERIAL    PRIMARY KEY,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    title       VARCHAR(255) NOT NULL,
    summary     TEXT,
    content     TEXT         NOT NULL DEFAULT '',
    cover_image VARCHAR(255),
    published   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX posts_published_idx ON posts (published);
CREATE INDEX posts_created_at_idx ON posts (created_at DESC);
