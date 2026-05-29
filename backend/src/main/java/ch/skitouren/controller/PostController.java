package ch.skitouren.controller;

import ch.skitouren.dto.PostDetailDto;
import ch.skitouren.dto.PostSummaryDto;
import ch.skitouren.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public Page<PostSummaryDto> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "12") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postService.listPublished(pageable);
    }

    @GetMapping("/{slug}")
    public PostDetailDto get(@PathVariable String slug) {
        return postService.getPublishedBySlug(slug);
    }
}
