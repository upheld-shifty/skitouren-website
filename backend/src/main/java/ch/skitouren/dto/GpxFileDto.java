package ch.skitouren.dto;

import java.time.Instant;

public record GpxFileDto(
        Long id,
        String downloadUrl,
        String originalName,
        Instant createdAt
) {}
