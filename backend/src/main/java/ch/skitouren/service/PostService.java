package ch.skitouren.service;

import ch.skitouren.domain.Post;
import ch.skitouren.dto.PostDetailDto;
import ch.skitouren.dto.PostSummaryDto;
import ch.skitouren.dto.PostWriteDto;
import ch.skitouren.exception.ResourceNotFoundException;
import ch.skitouren.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;

@Service
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Page<PostSummaryDto> listPublished(Pageable pageable) {
        return postRepository.findByPublishedTrue(pageable).map(this::toSummary);
    }

    public PostDetailDto getPublishedBySlug(String slug) {
        Post post = postRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + slug));
        return toDetail(post);
    }

    public Page<PostSummaryDto> listAll(Pageable pageable) {
        return postRepository.findAll(pageable).map(this::toSummary);
    }

    public PostDetailDto getById(Long id) {
        return toDetail(findOrThrow(id));
    }

    @Transactional
    public PostDetailDto create(PostWriteDto dto) {
        Post post = new Post();
        post.setSlug(generateUniqueSlug(dto.title()));
        applyDto(post, dto);
        return toDetail(postRepository.save(post));
    }

    @Transactional
    public PostDetailDto update(Long id, PostWriteDto dto) {
        Post post = findOrThrow(id);
        applyDto(post, dto);
        return toDetail(postRepository.save(post));
    }

    @Transactional
    public void delete(Long id) {
        postRepository.delete(findOrThrow(id));
    }

    @Transactional
    public PostDetailDto setPublished(Long id, boolean published) {
        Post post = findOrThrow(id);
        post.setPublished(published);
        return toDetail(postRepository.save(post));
    }

    @Transactional
    public PostDetailDto setCoverImage(Long id, String filename) {
        Post post = findOrThrow(id);
        post.setCoverImage(filename);
        return toDetail(postRepository.save(post));
    }

    @Transactional
    public PostDetailDto removeCoverImage(Long id) {
        Post post = findOrThrow(id);
        post.setCoverImage(null);
        return toDetail(postRepository.save(post));
    }

    /** Raw entity access for the controller (needed to retrieve old filename before replace). */
    public Post getRaw(Long id) {
        return findOrThrow(id);
    }

    // ── internals ────────────────────────────────────────────────────────────

    private Post findOrThrow(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found: " + id));
    }

    private void applyDto(Post post, PostWriteDto dto) {
        post.setTitle(dto.title());
        post.setSummary(dto.summary());
        post.setContent(dto.content());
    }

    private PostSummaryDto toSummary(Post p) {
        return new PostSummaryDto(
                p.getId(), p.getSlug(), p.getTitle(), p.getSummary(),
                coverUrl(p.getCoverImage()), p.isPublished(), p.getCreatedAt());
    }

    private PostDetailDto toDetail(Post p) {
        return new PostDetailDto(
                p.getId(), p.getSlug(), p.getTitle(), p.getSummary(),
                p.getContent(), coverUrl(p.getCoverImage()),
                p.isPublished(), p.getCreatedAt(), p.getUpdatedAt());
    }

    private static String coverUrl(String filename) {
        return filename != null ? "/api/files/posts/" + filename : null;
    }

    private String generateUniqueSlug(String title) {
        String base = slugify(title);
        String slug = base;
        int    i    = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    private static String slugify(String text) {
        return Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-");
    }
}
