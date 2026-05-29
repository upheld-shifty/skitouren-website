package ch.skitouren.domain;

import java.util.EnumSet;
import java.util.Set;

public enum Difficulty {
    // Wanderung — SAC Wanderskala
    T1, T2, T3, T4, T5, T6, T6_PLUS,
    // Skitour & Schneeschuh — SAC Lawinenstufen
    WT1, WT2, WT3, WT4, WT5, WT6,
    // Klettersteig — SAC/DAV
    K1, K2, K3, K4, K5, K6,
    // Hochtour — SAC Hochtourenskala
    WS, ZS, S, SS, AS;

    private static final java.util.Map<TourType, Set<Difficulty>> VALID = new java.util.EnumMap<>(TourType.class);

    static {
        VALID.put(TourType.WANDERUNG,    EnumSet.of(T1, T2, T3, T4, T5, T6, T6_PLUS));
        VALID.put(TourType.SKITOUR,      EnumSet.of(WT1, WT2, WT3, WT4, WT5, WT6));
        VALID.put(TourType.KLETTERSTEIG, EnumSet.of(K1, K2, K3, K4, K5, K6));
        VALID.put(TourType.HOCHTOUR,     EnumSet.of(WS, ZS, S, SS, AS));
        VALID.put(TourType.SCHNEESCHUH,  EnumSet.of(WT1, WT2, WT3, WT4, WT5, WT6));
    }

    public boolean isValidFor(TourType type) {
        return VALID.getOrDefault(type, EnumSet.noneOf(Difficulty.class)).contains(this);
    }

    public static Set<Difficulty> validFor(TourType type) {
        return VALID.getOrDefault(type, EnumSet.noneOf(Difficulty.class));
    }

    public String displayName() {
        return name().replace("_PLUS", "+");
    }

    /** Risk level 1 (easy) – 4 (extreme) for colour-coding in the UI. */
    public int riskLevel() {
        return switch (this) {
            case T1, T2, WT1, WT2, K1, K2, WS      -> 1;
            case T3, T4, WT3, WT4, K3, ZS           -> 2;
            case T5, WT5, K4, K5, S, SS             -> 3;
            case T6, T6_PLUS, WT6, K6, AS           -> 4;
        };
    }
}
