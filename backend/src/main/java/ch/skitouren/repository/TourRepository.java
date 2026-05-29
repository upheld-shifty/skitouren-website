package ch.skitouren.repository;

import ch.skitouren.domain.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TourRepository extends JpaRepository<Tour, Long>, JpaSpecificationExecutor<Tour> {

    Optional<Tour> findBySlug(String slug);

    Optional<Tour> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);

    /**
     * Returns a single row: [COUNT, SUM(distanceKm), SUM(elevationUp), SUM(durationMin)]
     * All sums may be null when no tours are published.
     */
    @Query("SELECT COUNT(t), SUM(t.distanceKm), SUM(t.elevationUp), SUM(t.durationMin) " +
           "FROM Tour t WHERE t.published = true")
    List<Object[]> findAggregateStats();

    /**
     * Returns rows: [TourType, COUNT, SUM(distanceKm)] ordered by count descending.
     */
    @Query("SELECT t.tourType, COUNT(t), SUM(t.distanceKm) " +
           "FROM Tour t WHERE t.published = true " +
           "GROUP BY t.tourType ORDER BY COUNT(t) DESC")
    List<Object[]> findStatsByType();
}
