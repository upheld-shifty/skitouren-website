package ch.skitouren.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content = "";

    @Column(length = 255)
    private String coverImage;   // UUID-based filename in storage/posts/

    @Column(nullable = false)
    private boolean published = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    public Post() {}

    @PrePersist
    private void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    private void preUpdate() {
        updatedAt = Instant.now();
    }

    public Long    getId()          { return id; }
    public String  getSlug()        { return slug; }
    public String  getTitle()       { return title; }
    public String  getSummary()     { return summary; }
    public String  getContent()     { return content; }
    public String  getCoverImage()  { return coverImage; }
    public boolean isPublished()    { return published; }
    public Instant getCreatedAt()   { return createdAt; }
    public Instant getUpdatedAt()   { return updatedAt; }

    public void setSlug(String slug)            { this.slug = slug; }
    public void setTitle(String title)          { this.title = title; }
    public void setSummary(String summary)      { this.summary = summary; }
    public void setContent(String content)      { this.content = content; }
    public void setCoverImage(String img)       { this.coverImage = img; }
    public void setPublished(boolean published) { this.published = published; }
}
