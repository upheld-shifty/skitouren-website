package ch.skitouren.dto;

import ch.skitouren.domain.Difficulty;
import ch.skitouren.domain.TourType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TourSummaryDto(
        Long id,
        String slug,
        String title,
        TourType tourType,
        Difficulty difficulty,
        RegionDto region,
        Integer elevationUp,
        BigDecimal distanceKm,
        Integer durationMin,
        LocalDate tourDate,
        String coverPhotoUrl,
        boolean published
) {}
