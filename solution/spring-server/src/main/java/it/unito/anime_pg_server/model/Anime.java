package it.unito.anime_pg_server.model;

import jakarta.persistence.*;

@Entity
@Table(name = "animes")
public class Anime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer year;
    private String genre;

    public Anime() {}

    public Anime(String title, Integer year, String genre) {
        this.title = title;
        this.year = year;
        this.genre = genre;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public Integer getYear() { return year; }
    public String getGenre() { return genre; }

    public void setTitle(String title) { this.title = title; }
    public void setYear(Integer year) { this.year = year; }
    public void setGenre(String genre) { this.genre = genre; }
}
