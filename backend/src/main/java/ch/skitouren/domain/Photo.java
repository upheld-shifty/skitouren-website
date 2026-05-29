package ch.skitouren.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "photos")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(length = 255)
    private String originalName;

    @Column(length = 500)
    private String caption;

    @Column(nullable = false)
    private int sortOrder = 0;

    @Column(name = "is_cover", nullable = false)
    private boolean cover = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Photo() {}

    public Photo(Tour tour, String filename, String originalName) {
        this.tour = tour;
        this.filename = filename;
        this.originalName = originalName;
        this.createdAt = Instant.now();
    }

    public Long getId()            { return id; }
    public Tour getTour()          { return tour; }
    public String getFilename()    { return filename; }
    public String getOriginalName(){ return originalName; }
    public String getCaption()     { return caption; }
    public int getSortOrder()      { return sortOrder; }
    public boolean isCover()       { return cover; }
    public Instant getCreatedAt()  { return createdAt; }

    public void setCaption(String caption)    { this.caption = caption; }
    public void setSortOrder(int sortOrder)   { this.sortOrder = sortOrder; }
    public void setCover(boolean cover)       { this.cover = cover; }
}
