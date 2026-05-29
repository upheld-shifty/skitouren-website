ALTER TABLE tours
    ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (
            to_tsvector(
                'german'::regconfig,
                coalesce(title, '') || ' ' ||
                coalesce(summary, '') || ' ' ||
                coalesce(description, '') || ' ' ||
                coalesce(start_location, '') || ' ' ||
                coalesce(end_location, '')
            )
        ) STORED;

CREATE INDEX tours_search_vector_idx ON tours USING GIN (search_vector);
