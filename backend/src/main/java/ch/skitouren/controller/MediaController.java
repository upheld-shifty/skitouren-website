package ch.skitouren.controller;

import ch.skitouren.dto.GpxFileDto;
import ch.skitouren.dto.PhotoDto;
import ch.skitouren.dto.PhotoReorderDto;
import ch.skitouren.exception.ResourceNotFoundException;
import ch.skitouren.repository.GpxFileRepository;
import ch.skitouren.repository.TourRepository;
import ch.skitouren.service.FileStorageService;
import ch.skitouren.service.PhotoService;
import ch.skitouren.mapper.TourMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class MediaController {

    private final PhotoService       photoService;
    private final GpxFileRepository  gpxFileRepository;
    private final TourRepository     tourRepository;
    private final FileStorageService fileStorageService;
    private final TourMapper         mapper;

    public MediaController(PhotoService photoService,
                           GpxFileRepository gpxFileRepository,
                           TourRepository tourRepository,
                           FileStorageService fileStorageService,
                           TourMapper mapper) {
        this.photoService       = photoService;
        this.gpxFileRepository  = gpxFileRepository;
        this.tourRepository     = tourRepository;
        this.fileStorageService = fileStorageService;
        this.mapper             = mapper;
    }

    // ── Photos ───────────────────────────────────────────────────────────────

    @PostMapping("/tours/{tourId}/photos")
    @ResponseStatus(HttpStatus.CREATED)
    public List<PhotoDto> uploadPhotos(@PathVariable Long tourId,
                                       @RequestParam("files") List<MultipartFile> files) throws IOException {
        return photoService.addPhotos(tourId, files);
    }

    @DeleteMapping("/photos/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePhoto(@PathVariable Long id) throws IOException {
        photoService.deletePhoto(id);
    }

    @PatchMapping("/photos/{id}/cover")
    public PhotoDto setCover(@PathVariable Long id) {
        return photoService.setCover(id);
    }

    @PutMapping("/photos/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@Valid @RequestBody List<PhotoReorderDto> updates) {
        photoService.reorder(updates);
    }

    // ── GPX ──────────────────────────────────────────────────────────────────

    @PostMapping("/tours/{tourId}/gpx")
    @ResponseStatus(HttpStatus.CREATED)
    public GpxFileDto uploadGpx(@PathVariable Long tourId,
                                @RequestParam("file") MultipartFile file) throws IOException {
        var tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + tourId));

        // Replace existing GPX if present
        gpxFileRepository.findByTourId(tourId).ifPresent(existing -> {
            try {
                fileStorageService.deleteGpx(existing.getFilename());
            } catch (IOException ignored) {}
            gpxFileRepository.delete(existing);
        });

        String filename = fileStorageService.storeGpx(file);
        var gpx = new ch.skitouren.domain.GpxFile(tour, filename, file.getOriginalFilename());
        return mapper.toGpxFileDto(gpxFileRepository.save(gpx));
    }

    @DeleteMapping("/tours/{tourId}/gpx")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGpx(@PathVariable Long tourId) throws IOException {
        var gpx = gpxFileRepository.findByTourId(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("No GPX for tour: " + tourId));
        fileStorageService.deleteGpx(gpx.getFilename());
        gpxFileRepository.delete(gpx);
    }
}
