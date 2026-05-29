package ch.skitouren.controller;

import ch.skitouren.service.FileStorageService;
import org.springframework.core.io.PathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/photos/{filename}")
    public ResponseEntity<Resource> servePhoto(@PathVariable String filename) throws IOException {
        return serveFile(fileStorageService.resolvePhoto(filename), false);
    }

    @GetMapping("/posts/{filename}")
    public ResponseEntity<Resource> servePostCover(@PathVariable String filename) throws IOException {
        return serveFile(fileStorageService.resolvePostCover(filename), false);
    }

    @GetMapping("/gpx/{filename}")
    public ResponseEntity<Resource> serveGpx(@PathVariable String filename) throws IOException {
        return serveFile(fileStorageService.resolveGpx(filename), true);
    }

    private ResponseEntity<Resource> serveFile(Path path, boolean asAttachment) throws IOException {
        Resource resource = new PathResource(path);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(path);
        if (contentType == null) contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

        HttpHeaders headers = new HttpHeaders();
        if (asAttachment) {
            headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + path.getFileName() + "\"");
        }
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
