package ch.skitouren.controller;

import ch.skitouren.dto.TourDetailDto;
import ch.skitouren.dto.TourSummaryDto;
import ch.skitouren.dto.TourWriteDto;
import ch.skitouren.service.TourService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tours")
public class AdminTourController {

    private final TourService tourService;

    public AdminTourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public Page<TourSummaryDto> list(
            @RequestParam(required = false) Boolean published,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "50") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        return tourService.listAll(published, pageable);
    }

    @GetMapping("/{id}")
    public TourDetailDto get(@PathVariable Long id) {
        return tourService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TourDetailDto create(@Valid @RequestBody TourWriteDto dto) {
        return tourService.create(dto);
    }

    @PutMapping("/{id}")
    public TourDetailDto update(@PathVariable Long id, @Valid @RequestBody TourWriteDto dto) {
        return tourService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tourService.delete(id);
    }

    @PatchMapping("/{id}/publish")
    public TourDetailDto publish(@PathVariable Long id) {
        return tourService.setPublished(id, true);
    }

    @PatchMapping("/{id}/unpublish")
    public TourDetailDto unpublish(@PathVariable Long id) {
        return tourService.setPublished(id, false);
    }
}
