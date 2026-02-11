package com.tweb.anime.model;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Anime Entity - PostgreSQL Static Data
 * 
 * Represents anime details from Details.csv (28,955 entries)
 * Receives HTTP/Axios queries from main server
 * 
 * @author TWEB Team
 */
@Entity
@Table(name = "details")
public class Anime implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mal_id")
    private Long malId;

    @Column(name = "title", length = 500)
    private String title;

    @Column(name = "title_japanese", length = 500)
    private String titleJapanese;

    @Column(name = "title_english", length = 500)
    private String titleEnglish;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "source", length = 100)
    private String source;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "status", length = 100)
    private String status;

    @Column(name = "aired_from")
    private String airedFrom;

    @Column(name = "aired_to")
    private String airedTo;

    @Column(name = "duration", length = 100)
    private String duration;

    @Column(name = "rating", length = 100)
    private String rating;

    @Column(name = "score")
    private Double score;

    @Column(name = "scored_by")
    private Integer scoredBy;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "popularity")
    private Integer popularity;

    @Column(name = "members")
    private Integer members;

    @Column(name = "favorites")
    private Integer favorites;

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "background", columnDefinition = "TEXT")
    private String background;

    @Column(name = "premiered", length = 100)
    private String premiered;

    @Column(name = "broadcast", length = 100)
    private String broadcast;

    @Column(name = "studios", length = 500)
    private String studios;

    @Column(name = "genres", length = 500)
    private String genres;

    @Column(name = "url", length = 500)
    private String url;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    // Constructors
    public Anime() {
    }

    public Anime(Long malId, String title, String imageUrl) {
        this.malId = malId;
        this.title = title;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getMalId() {
        return malId;
    }

    public void setMalId(Long malId) {
        this.malId = malId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitleJapanese() {
        return titleJapanese;
    }

    public void setTitleJapanese(String titleJapanese) {
        this.titleJapanese = titleJapanese;
    }

    public String getTitleEnglish() {
        return titleEnglish;
    }

    public void setTitleEnglish(String titleEnglish) {
        this.titleEnglish = titleEnglish;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Integer getEpisodes() {
        return episodes;
    }

    public void setEpisodes(Integer episodes) {
        this.episodes = episodes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAiredFrom() {
        return airedFrom;
    }

    public void setAiredFrom(String airedFrom) {
        this.airedFrom = airedFrom;
    }

    public String getAiredTo() {
        return airedTo;
    }

    public void setAiredTo(String airedTo) {
        this.airedTo = airedTo;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getScoredBy() {
        return scoredBy;
    }

    public void setScoredBy(Integer scoredBy) {
        this.scoredBy = scoredBy;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getPopularity() {
        return popularity;
    }

    public void setPopularity(Integer popularity) {
        this.popularity = popularity;
    }

    public Integer getMembers() {
        return members;
    }

    public void setMembers(Integer members) {
        this.members = members;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public void setFavorites(Integer favorites) {
        this.favorites = favorites;
    }

    public String getSynopsis() {
        return synopsis;
    }

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public String getPremiered() {
        return premiered;
    }

    public void setPremiered(String premiered) {
        this.premiered = premiered;
    }

    public String getBroadcast() {
        return broadcast;
    }

    public void setBroadcast(String broadcast) {
        this.broadcast = broadcast;
    }

    public String getStudios() {
        return studios;
    }

    public void setStudios(String studios) {
        this.studios = studios;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    @Override
    public String toString() {
        return "Anime{" +
                "malId=" + malId +
                ", title='" + title + '\'' +
                ", type='" + type + '\'' +
                ", score=" + score +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}