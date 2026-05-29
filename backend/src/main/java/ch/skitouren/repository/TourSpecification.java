package ch.skitouren.repository;

import ch.skitouren.domain.Difficulty;
import ch.skitouren.domain.Tour;
import ch.skitouren.domain.TourType;
import org.springframework.data.jpa.domain.Specification;

public final class TourSpecification {

    private TourSpecification() {}

    public static Specification<Tour> published() {
        return (root, query, cb) -> cb.isTrue(root.get("published"));
    }

    public static Specification<Tour> hasType(TourType type) {
        return (root, query, cb) -> cb.equal(root.get("tourType"), type);
    }

    public static Specification<Tour> hasDifficulty(Difficulty difficulty) {
        return (root, query, cb) -> cb.equal(root.get("difficulty"), difficulty);
    }

    public static Specification<Tour> inRegion(Long regionId) {
        return (root, query, cb) -> cb.equal(root.get("region").get("id"), regionId);
    }

    public static Specification<Tour> matchesSearch(String q) {
        return (root, query, cb) ->
                cb.isTrue(cb.function("tsmatches", Boolean.class,
                        root.get("searchVector"),
                        cb.literal(q)));
    }
}
