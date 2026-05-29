package ch.skitouren.service;

import ch.skitouren.domain.Photo;
import ch.skitouren.domain.Tour;
import ch.skitouren.dto.PhotoDto;
import ch.skitouren.dto.PhotoReorderDto;
import ch.skitouren.exception.ResourceNotFoundException;
import ch.skitouren.mapper.TourMapper;
import ch.skitouren.repository.PhotoRepository;
import ch.skitouren.repository.TourRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional
public class PhotoService {

    private final PhotoRepository   photoRepository;
    private final TourRepository    tourRepository;
    private final FileStorageService fileStorageService;
    private final TourMapper        mapper;

    public PhotoService(PhotoRepository photoRepository,
                        TourRepository tourRepository,
                        FileStorageService fileStorageService,
                        TourMapper mapper) {
        this.photoRepository   = photoRepository;
        this.tourRepository    = tourRepository;
        this.fileStorageService = fileStorageService;
        this.mapper            = mapper;
    }

    public List<PhotoDto> addPhotos(Long tourId, List<MultipartFile> files) throws IOException {
        Tour tour = findTourOrThrow(tourId);
        int  nextOrder = tour.getPhotos().size();

        for (MultipartFile file : files) {
            String filename = fileStorageService.storePhoto(file);
            Photo photo = new Photo(tour, filename, file.getOriginalFilename());
            photo.setSortOrder(nextOrder++);
            if (tour.getPhotos().isEmpty()) {
                photo.setCover(true);
            }
            photoRepository.save(photo);
        }
        return photoRepository.findByTourIdOrderBySortOrderAscIdAsc(tourId)
                .stream().map(mapper::toPhotoDto).toList();
    }

    public void deletePhoto(Long photoId) throws IOException {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found: " + photoId));
        fileStorageService.deletePhoto(photo.getFilename());
        photoRepository.delete(photo);
    }

    public PhotoDto setCover(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found: " + photoId));
        photoRepository.clearCoverForTour(photo.getTour().getId());
        photo.setCover(true);
        return mapper.toPhotoDto(photoRepository.save(photo));
    }

    public void reorder(List<PhotoReorderDto> updates) {
        updates.forEach(u -> {
            Photo photo = photoRepository.findById(u.id())
                    .orElseThrow(() -> new ResourceNotFoundException("Photo not found: " + u.id()));
            photo.setSortOrder(u.sortOrder());
            photoRepository.save(photo);
        });
    }

    private Tour findTourOrThrow(Long id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found: " + id));
    }
}
