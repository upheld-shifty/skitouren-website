package ch.skitouren.service;

import ch.skitouren.config.AppProperties;
import jakarta.annotation.PostConstruct;
import org.imgscalr.Scalr;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_PHOTO_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );
    private static final int MAX_PHOTO_DIMENSION = 2000;

    private final Path photosDir;
    private final Path postsDir;
    private final Path gpxDir;
    private final long maxPhotoBytes;
    private final long maxGpxBytes;

    public FileStorageService(AppProperties props) {
        Path root = Path.of(props.storage().root());
        this.photosDir    = root.resolve("photos");
        this.postsDir     = root.resolve("posts");
        this.gpxDir       = root.resolve("gpx");
        this.maxPhotoBytes = (long) props.storage().maxPhotoSizeMb() * 1024 * 1024;
        this.maxGpxBytes   = (long) props.storage().maxGpxSizeMb()   * 1024 * 1024;
    }

    @PostConstruct
    void createDirectories() throws IOException {
        Files.createDirectories(photosDir);
        Files.createDirectories(postsDir);
        Files.createDirectories(gpxDir);
    }

    public String storePhoto(MultipartFile file) throws IOException {
        validatePhoto(file);
        String ext        = extensionOf(file.getOriginalFilename(), "jpg");
        String filename   = UUID.randomUUID() + "." + ext;
        Path   targetPath = photosDir.resolve(filename);

        if (isResizeable(file.getContentType())) {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img != null && (img.getWidth() > MAX_PHOTO_DIMENSION || img.getHeight() > MAX_PHOTO_DIMENSION)) {
                img = Scalr.resize(img, Scalr.Method.QUALITY, MAX_PHOTO_DIMENSION);
            }
            if (img != null) {
                ImageIO.write(img, ext.equals("jpg") ? "jpeg" : ext, targetPath.toFile());
                return filename;
            }
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        return filename;
    }

    public String storeGpx(MultipartFile file) throws IOException {
        validateGpx(file);
        String filename   = UUID.randomUUID() + ".gpx";
        Path   targetPath = gpxDir.resolve(filename);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        return filename;
    }

    public String storePostCover(MultipartFile file) throws IOException {
        validatePhoto(file);
        String ext        = extensionOf(file.getOriginalFilename(), "jpg");
        String filename   = UUID.randomUUID() + "." + ext;
        Path   targetPath = postsDir.resolve(filename);

        if (isResizeable(file.getContentType())) {
            BufferedImage img = ImageIO.read(file.getInputStream());
            if (img != null && (img.getWidth() > MAX_PHOTO_DIMENSION || img.getHeight() > MAX_PHOTO_DIMENSION)) {
                img = Scalr.resize(img, Scalr.Method.QUALITY, MAX_PHOTO_DIMENSION);
            }
            if (img != null) {
                ImageIO.write(img, ext.equals("jpg") ? "jpeg" : ext, targetPath.toFile());
                return filename;
            }
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, targetPath, StandardCopyOption.REPLACE_EXISTING);
        }
        return filename;
    }

    public void deletePhoto(String filename) throws IOException {
        Files.deleteIfExists(photosDir.resolve(filename));
    }

    public void deletePostCover(String filename) throws IOException {
        Files.deleteIfExists(postsDir.resolve(filename));
    }

    public void deleteGpx(String filename) throws IOException {
        Files.deleteIfExists(gpxDir.resolve(filename));
    }

    public Path resolvePhoto(String filename) {
        return photosDir.resolve(filename).normalize();
    }

    public Path resolvePostCover(String filename) {
        return postsDir.resolve(filename).normalize();
    }

    public Path resolveGpx(String filename) {
        return gpxDir.resolve(filename).normalize();
    }

    private void validatePhoto(MultipartFile file) {
        if (file.isEmpty()) throw new IllegalArgumentException("Photo file is empty");
        if (file.getSize() > maxPhotoBytes)
            throw new IllegalArgumentException("Photo exceeds maximum size");
        if (!ALLOWED_PHOTO_TYPES.contains(file.getContentType()))
            throw new IllegalArgumentException("Unsupported photo type: " + file.getContentType());
    }

    private void validateGpx(MultipartFile file) {
        if (file.isEmpty()) throw new IllegalArgumentException("GPX file is empty");
        if (file.getSize() > maxGpxBytes)
            throw new IllegalArgumentException("GPX file exceeds maximum size");
    }

    private boolean isResizeable(String contentType) {
        return "image/jpeg".equals(contentType) || "image/png".equals(contentType);
    }

    private String extensionOf(String filename, String fallback) {
        if (filename == null || !filename.contains(".")) return fallback;
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (ext) {
            case "jpg", "jpeg" -> "jpg";
            case "png"         -> "png";
            case "webp"        -> "webp";
            default            -> fallback;
        };
    }
}
