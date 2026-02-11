package com.tweb.anime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring Boot Application - HTTP/Axios Communication
 * 
 * Handles static anime data from PostgreSQL
 * Receives HTTP requests via Axios from main server
 * 
 * @author TWEB Team
 * @version 1.0.0
 */
@SpringBootApplication
public class AnimeApplication {

    public static void main(String[] args) {
        System.out.println("""
            ╔════════════════════════════════════════════════╗
            ║  SPRING BOOT SERVER - HTTP/Axios              ║
            ╠════════════════════════════════════════════════╣
            ║  Protocol:          HTTP                       ║
            ║  Receives:          Axios requests             ║
            ║  Port:              8080                       ║
            ║  Database:          PostgreSQL (anime_db)      ║
            ║  Swagger UI:        /swagger-ui.html           ║
            ╚════════════════════════════════════════════════╝
        """);
        
        SpringApplication.run(AnimeApplication.class, args);
    }

    /**
     * Configure CORS to accept HTTP requests via Axios
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3001", "http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}