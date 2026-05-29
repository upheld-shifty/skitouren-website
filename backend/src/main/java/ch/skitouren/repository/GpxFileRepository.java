package ch.skitouren.repository;

import ch.skitouren.domain.GpxFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GpxFileRepository extends JpaRepository<GpxFile, Long> {

    Optional<GpxFile> findByTourId(Long tourId);
}
