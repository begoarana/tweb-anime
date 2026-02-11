package com.tweb.anime.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Health Controller - HTTP endpoint
 * Receives Axios requests from main server
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "Health check via HTTP")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Returns status via HTTP")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Spring Boot server running");
        response.put("protocol", "HTTP");
        response.put("communication", "Receives Axios requests");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("database", checkDatabaseConnection());
        
        return ResponseEntity.ok(response);
    }

    private Map<String, String> checkDatabaseConnection() {
        Map<String, String> dbStatus = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            if (connection.isValid(5)) {
                dbStatus.put("status", "connected");
                dbStatus.put("database", connection.getCatalog());
            } else {
                dbStatus.put("status", "connection invalid");
            }
        } catch (Exception e) {
            dbStatus.put("status", "error");
            dbStatus.put("message", e.getMessage());
        }
        return dbStatus;
    }

    @GetMapping("/")
    @Operation(summary = "Root endpoint")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "Anime PostgreSQL Server");
        response.put("protocol", "HTTP");
        response.put("communication", "Axios");
        response.put("version", "1.0.0");
        response.put("swagger", "/swagger-ui.html");
        
        return ResponseEntity.ok(response);
    }
}