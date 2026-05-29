package ch.skitouren.service;

import ch.skitouren.domain.*;
import ch.skitouren.dto.*;
import ch.skitouren.exception.ResourceNotFoundException;
import ch.skitouren.mapper.TourMapper;
import ch.skitouren.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class TourService {

    private final TourRepository    tourRepository;
    private final RegionRepository  regionRepository;
    private final TourMapper        mapper;

    public TourService(TourRepository tourRepository,
                       RegionRepository regionRepository,
                       TourMapper mapper) {
        this.tourRepository   = tourRepository;
        this.regionRepository = regionRepository;
        this.mapper           = mapper;
    }

    public Page<TourSummaryDto> listPublished(TourType type, Difficulty difficulty,
                                              Long regionId, String q, Pageable pageable) {
        Specification<Tour> spec = TourSpecification.published();
        if (type       != null) spec = spec.and(TourSpecification.hasType(type));
        if (difficulty != null) spec = spec.and(TourSpecification.hasDifficulty(difficulty));
        if (regionId   != null) spec = spec.and(TourSpecification.inRegion(regionId));
        if (q != null && !q.isBlank()) spec = spec.and(TourSpecification.matchesSearch(q.trim()));
        return tourRepository.findAll(spec, pageable).map(mapper::toSummaryDto);
    }

    public TourDetailDto getPublishedBySlug(String slug) {
        Tour tour = tourRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + slug));
        return mapper.toDetailDto(tour);
    }

    public Page<TourSummaryDto> listAll(Boolean published, Pageable pageable) {
        if (published != null) {
            Specification<Tour> spec = published
                    ? TourSpecification.published()
                    : Specification.not(TourSpecification.published());
            return tourRepository.findAll(spec, pageable).map(mapper::toSummaryDto);
        }
        return tourRepository.findAll(pageable).map(mapper::toSummaryDto);
    }

    public TourDetailDto getById(Long id) {
        Tour tour = findOrThrow(id);
        return mapper.toDetailDto(tour);
    }

    @Transactional
    public TourDetailDto create(TourWriteDto dto) {
        validateDifficulty(dto.tourType(), dto.difficulty());
        Tour tour = new Tour();
        applyDto(tour, dto);
        tour.setSlug(generateUniqueSlug(dto.title(), dto.tourDate() != null ? dto.tourDate().getYear() : null));
        return mapper.toDetailDto(tourRepository.save(tour));
    }

    @Transactional
    public TourDetailDto update(Long id, TourWriteDto dto) {
        validateDifficulty(dto.tourType(), dto.difficulty());
        Tour tour = findOrThrow(id);
        applyDto(tour, dto);
        return mapper.toDetailDto(tourRepository.save(tour));
    }

    @Transactional
    public void delete(Long id) {
        tourRepository.delete(findOrThrow(id));
    }

    @Transactional
    public TourDetailDto setPublished(Long id, boolean published) {
        Tour tour = findOrThrow(id);
        tour.setPublished(published);
        return mapper.toDetailDto(tourRepository.save(tour));
    }

    public List<RegionDto> listRegions() {
        return regionRepository.findAll().stream().map(mapper::toRegionDto).toList();
    }

    // ── internals ────────────────────────────────────────────────────────────

    private Tour findOrThrow(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
    }

    private void applyDto(Tour tour, TourWriteDto dto) {
        tour.setTitle(dto.title());
        tour.setTourType(dto.tourType());
        tour.setDifficulty(dto.difficulty());
        tour.setSummary(dto.summary());
        tour.setDescription(dto.description());
        tour.setElevationUp(dto.elevationUp());
        tour.setElevationDown(dto.elevationDown());
        tour.setDistanceKm(dto.distanceKm());
        tour.setDurationMin(dto.durationMin());
        tour.setStartLocation(dto.startLocation());
        tour.setEndLocation(dto.endLocation());
        tour.setBestSeason(dto.bestSeason());
        tour.setTourDate(dto.tourDate());
        if (dto.regionId() != null) {
            tour.setRegion(regionRepository.findById(dto.regionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Region not found: " + dto.regionId())));
        } else {
            tour.setRegion(null);
        }
    }

    private void validateDifficulty(TourType type, Difficulty difficulty) {
        if (!difficulty.isValidFor(type)) {
            throw new IllegalArgumentException(
                    "Difficulty %s is not valid for tour type %s".formatted(difficulty, type));
        }
    }

    private String generateUniqueSlug(String title, Integer year) {
        String base = slugify(title) + (year != null ? "-" + year : "");
        String slug = base;
        int    i    = 1;
        while (tourRepository.existsBySlug(slug)) {
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
