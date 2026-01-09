package it.unito.anime_pg_server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import it.unito.anime_pg_server.model.Anime;

public interface AnimeRepository extends JpaRepository<Anime, Long> {
    List<Anime> findByTitleContainingIgnoreCase(String q);
}