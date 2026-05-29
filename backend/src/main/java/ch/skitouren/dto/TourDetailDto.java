package ch.skitouren.dto;

import ch.skitouren.domain.Difficulty;
import ch.skitouren.domain.TourType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record TourDetailDto(
        Long id,
        String slug,
        String title,
        TourType tourType,
        Difficulty difficulty,
        RegionDto region,
        String summary,
        String description,
        Integer elevationUp,
        Integer elevationDown,
        BigDecimal distanceKm,
        Integer durationMin,
        String startLocation,
        String endLocation,
        String bestSeason,
        LocalDate tourDate,
        boolean published,
        Instant createdAt,
        Instant updatedAt,
        List<PhotoDto> photos,
        GpxFileDto gpxFile
) {}
