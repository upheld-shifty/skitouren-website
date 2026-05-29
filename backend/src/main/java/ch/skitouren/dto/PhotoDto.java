package ch.skitouren.dto;

import java.time.Instant;

public record PhotoDto(
        Long id,
        String url,
        String originalName,
        String caption,
        int sortOrder,
        boolean cover,
        Instant createdAt
) {}
