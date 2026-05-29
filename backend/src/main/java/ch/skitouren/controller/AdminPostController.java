package ch.skitouren.controller;

import ch.skitouren.dto.PostDetailDto;
import ch.skitouren.dto.PostSummaryDto;
import ch.skitouren.dto.PostWriteDto;
import ch.skitouren.service.FileStorageService;
import ch.skitouren.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/posts")
public class AdminPostController {

    private final PostService        postService;
    private final FileStorageService fileStorage;

    public AdminPostController(PostService postService, FileStorageService fileStorage) {
        this.postService = postService;
        this.fileStorage = fileStorage;
    }

    @GetMapping
    public Page<PostSummaryDto> list(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return postService.listAll(pageable);
    }

    @GetMapping("/{id}")
    public PostDetailDto get(@PathVariable Long id) {
        return postService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostDetailDto create(@Valid @RequestBody PostWriteDto dto) {
        return postService.create(dto);
    }

    @PutMapping("/{id}")
    public PostDetailDto update(@PathVariable Long id, @Valid @RequestBody PostWriteDto dto) {
        return postService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        // Delete cover image file if present before removing the entity
        String cover = postService.getRaw(id).getCoverImage();
        postService.delete(id);
        if (cover != null) {
            try { fileStorage.deletePostCover(cover); } catch (IOException ignored) {}
        }
    }

    @PatchMapping("/{id}/publish")
    public PostDetailDto publish(@PathVariable Long id) {
        return postService.setPublished(id, true);
    }

    @PatchMapping("/{id}/unpublish")
    public PostDetailDto unpublish(@PathVariable Long id) {
        return postService.setPublished(id, false);
    }

    @PostMapping("/{id}/cover")
    public PostDetailDto uploadCover(@PathVariable Long id,
                                     @RequestParam("file") MultipartFile file) throws IOException {
        // Delete old cover if replacing
        String oldCover = postService.getRaw(id).getCoverImage();
        if (oldCover != null) fileStorage.deletePostCover(oldCover);

        String filename = fileStorage.storePostCover(file);
        return postService.setCoverImage(id, filename);
    }

    @DeleteMapping("/{id}/cover")
    public PostDetailDto deleteCover(@PathVariable Long id) throws IOException {
        String cover = postService.getRaw(id).getCoverImage();
        if (cover != null) fileStorage.deletePostCover(cover);
        return postService.removeCoverImage(id);
    }
}
