package ch.skitouren.repository;

import ch.skitouren.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Page<Post> findByPublishedTrue(Pageable pageable);

    Optional<Post> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlug(String slug);
}
