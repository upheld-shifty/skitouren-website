package ch.skitouren.controller;

import ch.skitouren.domain.Difficulty;
import ch.skitouren.domain.TourType;
import ch.skitouren.dto.RegionDto;
import ch.skitouren.dto.TourDetailDto;
import ch.skitouren.dto.TourSummaryDto;
import ch.skitouren.service.TourService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping("/tours")
    public Page<TourSummaryDto> list(
            @RequestParam(required = false) TourType   type,
            @RequestParam(required = false) Difficulty difficulty,
            @RequestParam(required = false) Long       region,
            @RequestParam(required = false) String     q,
            @RequestParam(defaultValue = "0")  int    page,
            @RequestParam(defaultValue = "20") int    size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "tourDate", "id"));
        return tourService.listPublished(type, difficulty, region, q, pageable);
    }

    @GetMapping("/tours/{slug}")
    public TourDetailDto getBySlug(@PathVariable String slug) {
        return tourService.getPublishedBySlug(slug);
    }

    @GetMapping("/regions")
    public List<RegionDto> regions() {
        return tourService.listRegions();
    }
}
