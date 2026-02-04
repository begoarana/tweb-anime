/**
 * API Client - HTTP/Axios Communication
 * 
 * This module handles all HTTP requests via Axios to the main server
 * Main server coordinates with Express MongoDB and Spring Boot servers
 * 
 * @module API
 */

// Base URL - Main server that coordinates via Axios
const API_BASE_URL = 'http://localhost:3001';

/**
 * Axios instance configured for HTTP communication
 */
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Request interceptor - logs HTTP requests
 */
apiClient.interceptors.request.use(
    (config) => {
        console.log(`[HTTP Request via Axios] ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[HTTP Request Error]', error);
        return Promise.reject(error);
    }
);

/**
 * Response interceptor - handles HTTP responses and errors
 */
apiClient.interceptors.response.use(
    (response) => {
        console.log(`[HTTP Response] ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error('[HTTP Response Error]', error.response || error);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else if (error.request) {
            console.error('No HTTP response received from server');
        } else {
            console.error('HTTP Error:', error.message);
        }
        return Promise.reject(error);
    }
);

/**
 * API Methods - All communicate via HTTP/Axios
 */
const API = {
    /**
     * Health check - test HTTP connectivity
     */
    healthCheck: async () => {
        try {
            const response = await apiClient.get('/api/health');
            return response.data;
        } catch (error) {
            throw new Error('Failed to connect via HTTP: ' + error.message);
        }
    },

    /**
     * Search anime by title (HTTP GET via Axios)
     */
    searchAnime: async (title) => {
        try {
            const response = await apiClient.get('/api/anime/search', {
                params: { title }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return [];
            }
            throw new Error('HTTP search failed: ' + error.message);
        }
    },

    /**
     * Get anime by ID with image (HTTP GET)
     */
    getAnimeById: async (id) => {
        try {
            const response = await apiClient.get(`/api/anime/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('Anime not found');
            }
            throw new Error('HTTP request failed: ' + error.message);
        }
    },

    /**
     * Get top rated anime with images (HTTP GET)
     */
    getTopRated: async (limit = 12) => {
        try {
            const response = await apiClient.get('/api/anime/top-rated', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch top rated via HTTP: ' + error.message);
        }
    },

    /**
     * Get popular anime (HTTP GET)
     */
    getPopular: async (limit = 12) => {
        try {
            const response = await apiClient.get('/api/anime/popular', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw new Error('HTTP request failed: ' + error.message);
        }
    },

    /**
     * Get characters with images (HTTP GET to Spring Boot via main server)
     */
    getPopularCharacters: async (limit = 12) => {
        try {
            // This will be proxied through main server to Spring Boot
            const response = await axios.get('http://localhost:8080/api/characters/popular', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Character fetch error:', error);
            return [];
        }
    },

    /**
     * Get people/actors with photos (HTTP GET to Spring Boot)
     */
    getPopularPeople: async (limit = 12) => {
        try {
            const response = await axios.get('http://localhost:8080/api/people/popular', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('People fetch error:', error);
            return [];
        }
    },

    /**
     * Get user ratings (HTTP GET to MongoDB via main server)
     */
    getUserRatings: async (userId) => {
        try {
            const response = await apiClient.get(`/api/ratings/user/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error('HTTP request failed: ' + error.message);
        }
    }
};

// Make API available globally
window.API = API;