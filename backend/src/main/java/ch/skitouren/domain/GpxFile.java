package ch.skitouren.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "gpx_files")
public class GpxFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false, unique = true)
    private Tour tour;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(length = 255)
    private String originalName;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public GpxFile() {}

    public GpxFile(Tour tour, String filename, String originalName) {
        this.tour = tour;
        this.filename = filename;
        this.originalName = originalName;
        this.createdAt = Instant.now();
    }

    public Long getId()            { return id; }
    public Tour getTour()          { return tour; }
    public String getFilename()    { return filename; }
    public String getOriginalName(){ return originalName; }
    public Instant getCreatedAt()  { return createdAt; }

    public void setFilename(String filename)       { this.filename = filename; }
    public void setOriginalName(String name)       { this.originalName = name; }
}
