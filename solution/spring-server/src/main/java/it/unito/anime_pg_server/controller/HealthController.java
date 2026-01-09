package it.unito.anime_pg_server.controller;
// This line defines the package where the controller is located.
// It helps Spring Boot organize the project structure.

import java.util.Map;
// We use Map to easily return a JSON-style response.
import org.springframework.jdbc.core.JdbcTemplate;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
// These annotations tell Spring that this class is a REST controller
// and that it will handle HTTP requests.

@RestController
// Marks this class as a REST controller.
// Spring will automatically detect it and expose its endpoints.
public class HealthController {
        private final JdbcTemplate jdbc;

    public HealthController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }


    @GetMapping("/health")
    // This method will be executed when someone visits /health in the browser.
    // It responds to HTTP GET requests.
    public Map<String, Object> health() {

        // We return a simple JSON object with some information.
        // This is useful to quickly check if the server is running correctly.
        return Map.of(
            "ok", true,                 // Indicates that the service is working
            "service", "anime-pg-server", // Name of the service
            "message", "Spring Boot is running!" // Human-readable message
        );
    }
        @GetMapping("/db-check")
    public Map<String, Object> dbCheck() {
        try {
            Integer one = jdbc.queryForObject("SELECT 1", Integer.class);
            return Map.of(
                "ok", true,
                "db", "connected",
                "result", one
            );
        } catch (Exception e) {
            return Map.of(
                "ok", false,
                "db", "error",
                "message", e.getMessage()
            );
        }
    }

}
