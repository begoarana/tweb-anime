package com.tweb.anime.repository;

import com.tweb.anime.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Person Repository
 * For displaying actor/staff images in frontend
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    /**
     * Search people by name
     */
    @Query("SELECT p FROM Person p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Person> findByNameContainingIgnoreCase(@Param("name") String name);

    /**
     * Find popular people (voice actors, staff)
     */
    @Query("SELECT p FROM Person p WHERE p.favorites IS NOT NULL AND p.imageUrl IS NOT NULL ORDER BY p.favorites DESC")
    List<Person> findPopularPeople();

    /**
     * Find people with images
     */
    @Query("SELECT p FROM Person p WHERE p.imageUrl IS NOT NULL")
    List<Person> findAllWithImages();
}