package ch.skitouren.dto;

import java.util.List;

public record StatsDto(
        long   totalTours,
        double totalKm,
        long   totalElevationUp,
        long   totalDurationHours,
        List<TypeStat> byType
) {
    /** Per-type breakdown returned inside the stats response. */
    public record TypeStat(String tourType, long count, double km) {}
}
