package ch.skitouren.domain;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TourType tourType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Difficulty difficulty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id")
    private Region region;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer elevationUp;
    private Integer elevationDown;

    @Column(precision = 6, scale = 2)
    private BigDecimal distanceKm;

    private Integer durationMin;

    @Column(length = 255)
    private String startLocation;

    @Column(length = 255)
    private String endLocation;

    @Column(length = 100)
    private String bestSeason;

    private LocalDate tourDate;

    @Column(nullable = false)
    private boolean published = false;

    @Column(name = "search_vector", insertable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.OTHER)
    private Object searchVector;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    private List<Photo> photos = new ArrayList<>();

    @OneToOne(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private GpxFile gpxFile;

    public Tour() {}

    @PrePersist
    private void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId()                 { return id; }
    public String getSlug()             { return slug; }
    public String getTitle()            { return title; }
    public TourType getTourType()       { return tourType; }
    public Difficulty getDifficulty()   { return difficulty; }
    public Region getRegion()           { return region; }
    public String getSummary()          { return summary; }
    public String getDescription()      { return description; }
    public Integer getElevationUp()     { return elevationUp; }
    public Integer getElevationDown()   { return elevationDown; }
    public BigDecimal getDistanceKm()   { return distanceKm; }
    public Integer getDurationMin()     { return durationMin; }
    public String getStartLocation()    { return startLocation; }
    public String getEndLocation()      { return endLocation; }
    public String getBestSeason()       { return bestSeason; }
    public LocalDate getTourDate()      { return tourDate; }
    public boolean isPublished()        { return published; }
    public Instant getCreatedAt()       { return createdAt; }
    public Instant getUpdatedAt()       { return updatedAt; }
    public List<Photo> getPhotos()      { return photos; }
    public GpxFile getGpxFile()         { return gpxFile; }

    public void setSlug(String slug)                    { this.slug = slug; }
    public void setTitle(String title)                  { this.title = title; }
    public void setTourType(TourType tourType)          { this.tourType = tourType; }
    public void setDifficulty(Difficulty difficulty)    { this.difficulty = difficulty; }
    public void setRegion(Region region)                { this.region = region; }
    public void setSummary(String summary)              { this.summary = summary; }
    public void setDescription(String description)      { this.description = description; }
    public void setElevationUp(Integer elevationUp)     { this.elevationUp = elevationUp; }
    public void setElevationDown(Integer elevationDown) { this.elevationDown = elevationDown; }
    public void setDistanceKm(BigDecimal distanceKm)    { this.distanceKm = distanceKm; }
    public void setDurationMin(Integer durationMin)     { this.durationMin = durationMin; }
    public void setStartLocation(String startLocation)  { this.startLocation = startLocation; }
    public void setEndLocation(String endLocation)      { this.endLocation = endLocation; }
    public void setBestSeason(String bestSeason)        { this.bestSeason = bestSeason; }
    public void setTourDate(LocalDate tourDate)         { this.tourDate = tourDate; }
    public void setPublished(boolean published)         { this.published = published; }
    public void setGpxFile(GpxFile gpxFile)             { this.gpxFile = gpxFile; }
}
