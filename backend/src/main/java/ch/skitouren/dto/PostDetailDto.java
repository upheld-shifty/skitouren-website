package ch.skitouren.dto;

import java.time.Instant;

public record PostDetailDto(
        Long    id,
        String  slug,
        String  title,
        String  summary,
        String  content,
        String  coverImageUrl,
        boolean published,
        Instant createdAt,
        Instant updatedAt
) {}
