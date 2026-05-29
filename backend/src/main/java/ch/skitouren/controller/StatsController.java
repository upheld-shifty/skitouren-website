package ch.skitouren.controller;

import ch.skitouren.dto.StatsDto;
import ch.skitouren.repository.TourRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final TourRepository tourRepo;

    public StatsController(TourRepository tourRepo) {
        this.tourRepo = tourRepo;
    }

    @GetMapping
    public StatsDto getStats() {
        // ── Aggregate totals ────────────────────────────────────────────────
        List<Object[]> aggRows = tourRepo.findAggregateStats();
        Object[] agg = aggRows.isEmpty() ? new Object[]{0L, null, null, null} : aggRows.get(0);

        long   totalTours        = agg[0] != null ? ((Number) agg[0]).longValue() : 0L;
        double totalKm           = agg[1] != null ? ((BigDecimal) agg[1]).doubleValue() : 0.0;
        long   totalElevationUp  = agg[2] != null ? ((Number) agg[2]).longValue() : 0L;
        long   totalDurationMin  = agg[3] != null ? ((Number) agg[3]).longValue() : 0L;
        long   totalDurationHours = Math.round(totalDurationMin / 60.0);

        // ── Per-type breakdown ──────────────────────────────────────────────
        List<StatsDto.TypeStat> byType = tourRepo.findStatsByType().stream()
                .map(row -> new StatsDto.TypeStat(
                        row[0].toString(),
                        ((Number) row[1]).longValue(),
                        row[2] != null ? ((BigDecimal) row[2]).doubleValue() : 0.0
                ))
                .toList();

        return new StatsDto(totalTours, totalKm, totalElevationUp, totalDurationHours, byType);
    }
}
