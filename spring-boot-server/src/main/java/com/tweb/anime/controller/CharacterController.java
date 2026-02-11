package com.tweb.anime.controller;

import com.tweb.anime.model.Character;
import com.tweb.anime.repository.CharacterRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Character Controller
 * 
 * Returns character data with images via HTTP/Axios
 * For displaying character photos in frontend
 */
@RestController
@RequestMapping("/api/characters")
@Tag(name = "Characters", description = "Character endpoints with images")
public class CharacterController {

    @Autowired
    private CharacterRepository characterRepository;

    /**
     * Search characters by name
     */
    @GetMapping("/search")
    @Operation(summary = "Search characters with images", 
               description = "Returns characters with image URLs for display")
    public ResponseEntity<List<Character>> searchCharacters(
            @Parameter(description = "Character name") @RequestParam String name) {
        
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Character> results = characterRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(results);
    }

    /**
     * Get character by ID with image
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get character details with image")
    public ResponseEntity<Character> getCharacterById(
            @Parameter(description = "Character ID") @PathVariable Long id) {
        
        Optional<Character> character = characterRepository.findById(id);
        return character.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get popular characters with images for display
     */
    @GetMapping("/popular")
    @Operation(summary = "Get popular characters with images")
    public ResponseEntity<List<Character>> getPopularCharacters(
            @RequestParam(defaultValue = "12") int limit) {
        
        List<Character> popular = characterRepository.findPopularCharacters();
        
        if (popular.size() > limit) {
            popular = popular.subList(0, limit);
        }
        
        return ResponseEntity.ok(popular);
    }

    /**
     * Get character gallery
     */
    @GetMapping("/gallery")
    @Operation(summary = "Get character image gallery")
    public ResponseEntity<List<Character>> getCharacterGallery(
            @RequestParam(defaultValue = "24") int limit) {
        
        List<Character> gallery = characterRepository.findAllWithImages();
        
        if (gallery.size() > limit) {
            gallery = gallery.subList(0, limit);
        }
        
        return ResponseEntity.ok(gallery);
    }

    /**
     * Get all characters
     */
    @GetMapping("/all")
    @Operation(summary = "Get all characters")
    public ResponseEntity<List<Character>> getAllCharacters() {
        List<Character> characters = characterRepository.findAll();
        return ResponseEntity.ok(characters);
    }

    /**
     * Get character count
     */
    @GetMapping("/count")
    @Operation(summary = "Get total character count")
    public ResponseEntity<Long> getCharacterCount() {
        long count = characterRepository.count();
        return ResponseEntity.ok(count);
    }
}