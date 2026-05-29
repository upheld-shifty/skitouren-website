package ch.skitouren.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(AuthProperties auth, StorageProperties storage) {

    // Nested records: no @ConfigurationProperties needed — bound automatically by parent
    public record AuthProperties(
            String username,
            String passwordHash,
            String jwtSecret,
            int jwtExpiryHours
    ) {}

    public record StorageProperties(
            String root,
            int maxPhotoSizeMb,
            int maxGpxSizeMb
    ) {}
}
