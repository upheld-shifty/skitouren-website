package ch.skitouren.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "regions")
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 10)
    private String country = "CH";

    public Region() {}

    public Region(String name, String country) {
        this.name = name;
        this.country = country;
    }

    public Long getId()      { return id; }
    public String getName()  { return name; }
    public String getCountry() { return country; }

    public void setName(String name)       { this.name = name; }
    public void setCountry(String country) { this.country = country; }
}
