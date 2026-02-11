package com.tweb.anime.repository;

import com.tweb.anime.model.Anime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Anime Repository
 * 
 * Data access for anime via HTTP/Axios requests
 */
@Repository
public interface AnimeRepository extends JpaRepository<Anime, Long> {

    /**
     * Search anime by title (case-insensitive, partial match)
     * Called via HTTP from main server using Axios
     */
    @Query("SELECT a FROM Anime a WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Anime> findByTitleContainingIgnoreCase(@Param("title") String title);

    /**
     * Find anime by type
     */
    List<Anime> findByType(String type);

    /**
     * Find top rated anime (with images for display)
     */
    @Query("SELECT a FROM Anime a WHERE a.score IS NOT NULL AND a.imageUrl IS NOT NULL ORDER BY a.score DESC")
    List<Anime> findTopRated();

    /**
     * Find most popular anime
     */
    @Query("SELECT a FROM Anime a WHERE a.popularity IS NOT NULL AND a.imageUrl IS NOT NULL ORDER BY a.popularity ASC")
    List<Anime> findMostPopular();

    /**
     * Find anime with images (for gallery display)
     */
    @Query("SELECT a FROM Anime a WHERE a.imageUrl IS NOT NULL")
    List<Anime> findAllWithImages();
}