package ch.skitouren.repository;

import ch.skitouren.domain.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByTourIdOrderBySortOrderAscIdAsc(Long tourId);

    @Modifying
    @Query("UPDATE Photo p SET p.cover = false WHERE p.tour.id = :tourId")
    void clearCoverForTour(Long tourId);
}
