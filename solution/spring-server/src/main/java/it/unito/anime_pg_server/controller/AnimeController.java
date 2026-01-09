package it.unito.anime_pg_server.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import it.unito.anime_pg_server.model.Anime;
import it.unito.anime_pg_server.repository.AnimeRepository;

@RestController
@RequestMapping("/api/animes")
public class AnimeController {

    private final AnimeRepository repo;

    public AnimeController(AnimeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Anime> all() {
        return repo.findAll();
    }

    @GetMapping("/search")
    public List<Anime> search(@RequestParam String q) {
        return repo.findByTitleContainingIgnoreCase(q);
    }
}
