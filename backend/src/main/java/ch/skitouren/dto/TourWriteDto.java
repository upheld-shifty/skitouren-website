package ch.skitouren.dto;

import ch.skitouren.domain.Difficulty;
import ch.skitouren.domain.TourType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TourWriteDto(
        @NotBlank String title,
        @NotNull TourType tourType,
        @NotNull Difficulty difficulty,
        Long regionId,
        String summary,
        String description,
        @Min(0) Integer elevationUp,
        @Min(0) Integer elevationDown,
        @DecimalMin("0.0") BigDecimal distanceKm,
        @Min(0) Integer durationMin,
        String startLocation,
        String endLocation,
        String bestSeason,
        LocalDate tourDate
) {}
