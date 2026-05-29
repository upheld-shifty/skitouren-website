package ch.skitouren.mapper;

import ch.skitouren.domain.GpxFile;
import ch.skitouren.domain.Photo;
import ch.skitouren.domain.Region;
import ch.skitouren.domain.Tour;
import ch.skitouren.dto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TourMapper {

    @Mapping(target = "coverPhotoUrl", expression = "java(coverPhotoUrl(tour))")
    TourSummaryDto toSummaryDto(Tour tour);

    @Mapping(target = "photos",  expression = "java(tour.getPhotos().stream().map(this::toPhotoDto).toList())")
    @Mapping(target = "gpxFile", expression = "java(tour.getGpxFile() != null ? toGpxFileDto(tour.getGpxFile()) : null)")
    TourDetailDto toDetailDto(Tour tour);

    RegionDto toRegionDto(Region region);

    @Mapping(target = "url", expression = "java(\"/api/files/photos/\" + photo.getFilename())")
    @Mapping(target = "cover", source = "cover")
    PhotoDto toPhotoDto(Photo photo);

    @Mapping(target = "downloadUrl", expression = "java(\"/api/files/gpx/\" + gpxFile.getFilename())")
    GpxFileDto toGpxFileDto(GpxFile gpxFile);

    default String coverPhotoUrl(Tour tour) {
        return tour.getPhotos().stream()
                .filter(Photo::isCover)
                .findFirst()
                .or(() -> tour.getPhotos().stream().findFirst())
                .map(p -> "/api/files/photos/" + p.getFilename())
                .orElse(null);
    }
}
