package com.tweb.anime.controller;

import com.tweb.anime.model.Person;
import com.tweb.anime.repository.PersonRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Person Controller
 * 
 * Returns person/actor data with images via HTTP/Axios
 * For displaying actor/voice actor/staff photos in frontend
 */
@RestController
@RequestMapping("/api/people")
@Tag(name = "People", description = "People/Actors endpoints with images")
public class PersonController {

    @Autowired
    private PersonRepository personRepository;

    /**
     * Search people by name
     */
    @GetMapping("/search")
    @Operation(summary = "Search people/actors with images", 
               description = "Returns people with image URLs for actor display")
    public ResponseEntity<List<Person>> searchPeople(
            @Parameter(description = "Person name") @RequestParam String name) {
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Person> results = personRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(results);
    }

    /**
     * Get person by ID with image
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get person details with image")
    public ResponseEntity<Person> getPersonById(
            @Parameter(description = "Person ID") @PathVariable Long id) {
        
        Optional<Person> person = personRepository.findById(id);
        return person.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get popular people/actors with images
     */
    @GetMapping("/popular")
    @Operation(summary = "Get popular voice actors/staff with images")
    public ResponseEntity<List<Person>> getPopularPeople(
            @RequestParam(defaultValue = "12") int limit) {
        
        List<Person> popular = personRepository.findPopularPeople();
        
        if (popular.size() > limit) {
            popular = popular.subList(0, limit);
        }
        
        return ResponseEntity.ok(popular);
    }

    /**
     * Get people gallery for cast & crew display
     */
    @GetMapping("/gallery")
    @Operation(summary = "Get people image gallery (cast & crew)")
    public ResponseEntity<List<Person>> getPeopleGallery(
            @RequestParam(defaultValue = "24") int limit) {
        
        List<Person> gallery = personRepository.findAllWithImages();
        
        if (gallery.size() > limit) {
            gallery = gallery.subList(0, limit);
        }
        
        return ResponseEntity.ok(gallery);
    }

    /**
     * Get all people
     */
    @GetMapping("/all")
    @Operation(summary = "Get all people")
    public ResponseEntity<List<Person>> getAllPeople() {
        List<Person> people = personRepository.findAll();
        return ResponseEntity.ok(people);
    }

    /**
     * Get person count
     */
    @GetMapping("/count")
    @Operation(summary = "Get total people count")
    public ResponseEntity<Long> getPersonCount() {
        long count = personRepository.count();
        return ResponseEntity.ok(count);
    }
}