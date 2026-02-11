package com.tweb.anime.controller;

import com.tweb.anime.model.Anime;
import com.tweb.anime.repository.AnimeRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Anime Controller
 * 
 * REST endpoints that receive HTTP requests via Axios from main server
 * Returns anime data with images for frontend display
 */
@RestController
@RequestMapping("/api/anime")
@Tag(name = "Anime", description = "Anime endpoints - HTTP/Axios communication")
public class AnimeController {

    @Autowired
    private AnimeRepository animeRepository;

    /**
     * Search anime by title
     * Receives HTTP GET request via Axios
     */
    @GetMapping("/search")
    @Operation(summary = "Search anime via HTTP", 
               description = "Receives Axios request from main server, returns anime with images")
    public ResponseEntity<List<Anime>> searchAnime(
            @Parameter(description = "Title to search") @RequestParam String title) {
        
        if (title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<Anime> results = animeRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(results);
    }

    /**
     * Get anime by ID
     * Returns full details including image URL
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get anime by ID via HTTP")
    public ResponseEntity<Anime> getAnimeById(
            @Parameter(description = "MAL ID") @PathVariable Long id) {
        
        Optional<Anime> anime = animeRepository.findById(id);
        return anime.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get top rated anime with images
     * For homepage display
     */
    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated anime with images")
    public ResponseEntity<List<Anime>> getTopRated(
            @RequestParam(defaultValue = "12") int limit) {
        
        List<Anime> topRated = animeRepository.findTopRated();
        
        // Limit results for frontend display
        if (topRated.size() > limit) {
            topRated = topRated.subList(0, limit);
        }
        
        return ResponseEntity.ok(topRated);
    }

    /**
     * Get popular anime with images
     */
    @GetMapping("/popular")
    @Operation(summary = "Get popular anime with images")
    public ResponseEntity<List<Anime>> getMostPopular(
            @RequestParam(defaultValue = "12") int limit) {
        
        List<Anime> popular = animeRepository.findMostPopular();
        
        if (popular.size() > limit) {
            popular = popular.subList(0, limit);
        }
        
        return ResponseEntity.ok(popular);
    }

    /**
     * Get anime by type with images
     */
    @GetMapping("/type/{type}")
    @Operation(summary = "Filter anime by type")
    public ResponseEntity<List<Anime>> getAnimeByType(
            @Parameter(description = "Type: TV, Movie, OVA, etc.") @PathVariable String type) {
        
        List<Anime> results = animeRepository.findByType(type);
        return ResponseEntity.ok(results);
    }

    /**
     * Get anime with images for gallery
     */
    @GetMapping("/gallery")
    @Operation(summary = "Get anime gallery with images")
    public ResponseEntity<List<Anime>> getAnimeGallery(
            @RequestParam(defaultValue = "24") int limit) {
        
        List<Anime> gallery = animeRepository.findAllWithImages();
        
        if (gallery.size() > limit) {
            gallery = gallery.subList(0, limit);
        }
        
        return ResponseEntity.ok(gallery);
    }

    /**
     * Get anime count
     */
    @GetMapping("/count")
    @Operation(summary = "Get total anime count")
    public ResponseEntity<Long> getAnimeCount() {
        long count = animeRepository.count();
        return ResponseEntity.ok(count);
    }
}