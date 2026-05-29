package ch.skitouren.domain;

import jakarta.persistence.*;
import java.time.Instant;

// Named AppUser to avoid conflict with Spring Security's User class
@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.USER;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public AppUser() {}

    public AppUser(String username, String passwordHash) {
        this.username     = username;
        this.passwordHash = passwordHash;
        this.createdAt    = Instant.now();
    }

    @PrePersist
    private void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Long     getId()           { return id; }
    public String   getUsername()     { return username; }
    public String   getPasswordHash() { return passwordHash; }
    public UserRole getRole()         { return role; }
    public Instant  getCreatedAt()    { return createdAt; }

    public void setRole(UserRole role) { this.role = role; }
}
