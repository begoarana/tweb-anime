package com.tweb.anime.repository;

import com.tweb.anime.model.Character;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Character Repository
 * For displaying character images in frontend
 */
@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {

    /**
     * Search characters by name
     */
    @Query("SELECT c FROM Character c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Character> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find popular characters (with images)
     */
    @Query("SELECT c FROM Character c WHERE c.favorites IS NOT NULL AND c.imageUrl IS NOT NULL ORDER BY c.favorites DESC")
    List<Character> findPopularCharacters();

    /**
     * Find characters with images
     */
    @Query("SELECT c FROM Character c WHERE c.imageUrl IS NOT NULL")
    List<Character> findAllWithImages();
}