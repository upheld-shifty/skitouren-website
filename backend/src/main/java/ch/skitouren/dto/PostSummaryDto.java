package ch.skitouren.dto;

import java.time.Instant;

public record PostSummaryDto(
        Long    id,
        String  slug,
        String  title,
        String  summary,
        String  coverImageUrl,
        boolean published,
        Instant createdAt
) {}
