package it.unito.anime_pg_server.seed;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import it.unito.anime_pg_server.model.Anime;
import it.unito.anime_pg_server.repository.AnimeRepository;

@Configuration
public class DemoData {

    @Bean
    CommandLineRunner initDatabase(AnimeRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Anime("Naruto", 2002, "Action"));
                repo.save(new Anime("One Piece", 1999, "Adventure"));
                repo.save(new Anime("Death Note", 2006, "Thriller"));
            }
        };
    }
}
