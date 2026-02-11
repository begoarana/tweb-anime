package com.tweb.anime.model;

import jakarta.persistence.*;
import java.io.Serializable;

/**
 * Person Entity - PostgreSQL
 * 
 * Represents people (actors, voice actors, staff) from Person_details.csv
 * Includes person images for actor/staff display
 */
@Entity
@Table(name = "person_details")
public class Person implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long personId;

    @Column(name = "name", length = 500)
    private String name;

    @Column(name = "given_name", length = 500)
    private String givenName;

    @Column(name = "family_name", length = 500)
    private String familyName;

    @Column(name = "birthday")
    private String birthday;

    @Column(name = "url", length = 500)
    private String url;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "favorites")
    private Integer favorites;

    @Column(name = "about", columnDefinition = "TEXT")
    private String about;

    // Constructors
    public Person() {
    }

    public Person(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getPersonId() {
        return personId;
    }

    public void setPersonId(Long personId) {
        this.personId = personId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGivenName() {
        return givenName;
    }

    public void setGivenName(String givenName) {
        this.givenName = givenName;
    }

    public String getFamilyName() {
        return familyName;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
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

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public Integer getFavorites() {
        return favorites;
    }

    public void setFavorites(Integer favorites) {
        this.favorites = favorites;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    @Override
    public String toString() {
        return "Person{" +
                "personId=" + personId +
                ", name='" + name + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}