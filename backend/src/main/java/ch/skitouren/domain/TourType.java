package ch.skitouren.domain;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TourType {
    WANDERUNG("Wanderung"),
    SKITOUR("Skitour"),
    KLETTERSTEIG("Klettersteig"),
    HOCHTOUR("Hochtour"),
    SCHNEESCHUH("Schneeschuhtour");

    private final String label;

    TourType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return name();
    }

    public String displayName() {
        return label;
    }
}
