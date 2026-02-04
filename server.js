/**
 * Main Express Server - HTTP Communication via Axios
 * 
 * This server coordinates all requests using HTTP protocol
 * and Axios for inter-server communication
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3001;

// Backend servers URLs (HTTP protocol)
const EXPRESS_DB_URL = process.env.EXPRESS_DB_URL || 'http://localhost:3002';
const SPRING_BOOT_URL = process.env.SPRING_BOOT_URL || 'http://localhost:8080';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve static files (client folder)
app.use(express.static(path.join(__dirname, '../client')));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anime Main Server API',
      version: '1.0.0',
      description: 'Main coordinator using HTTP/Axios for inter-server communication'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server status
 */
app.get('/', (req, res) => {
  res.json({
    status: 'Main server running',
    port: PORT,
    protocol: 'HTTP',
    communication: 'Axios',
    backends: {
      expressDB: EXPRESS_DB_URL,
      springBoot: SPRING_BOOT_URL
    }
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check all servers health via HTTP
 *     description: Uses Axios to make HTTP requests to backend servers
 */
app.get('/api/health', async (req, res) => {
  try {
    // HTTP requests via Axios to backend servers
    const healthChecks = await Promise.allSettled([
      axios.get(`${EXPRESS_DB_URL}/health`, { timeout: 5000 }),
      axios.get(`${SPRING_BOOT_URL}/api/health`, { timeout: 5000 })
    ]);

    res.json({
      mainServer: 'healthy',
      protocol: 'HTTP',
      communication: 'Axios',
      expressDB: healthChecks[0].status === 'fulfilled' ? 'healthy' : 'unreachable',
      springBoot: healthChecks[1].status === 'fulfilled' ? 'healthy' : 'unreachable',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/anime/search:
 *   get:
 *     summary: Search anime via HTTP/Axios
 *     description: Delegates search to Spring Boot server using Axios HTTP request
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 */
app.get('/api/anime/search', async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'Title parameter required' });
    }

    // Axios HTTP GET request to Spring Boot server
    const response = await axios.get(`${SPRING_BOOT_URL}/api/anime/search`, {
      params: { title },
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Axios error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/anime/{id}:
 *   get:
 *     summary: Get anime details combining data from both servers
 *     description: Uses Axios to make parallel HTTP requests
 */
app.get('/api/anime/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Parallel Axios HTTP requests to both servers
    const [detailsResponse, ratingsResponse] = await Promise.all([
      axios.get(`${SPRING_BOOT_URL}/api/anime/${id}`, { 
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      }),
      axios.get(`${EXPRESS_DB_URL}/api/ratings/anime/${id}`, { 
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      })
    ]);

    // Combine data from both HTTP responses
    res.json({
      ...detailsResponse.data,
      ratings: ratingsResponse.data
    });
  } catch (error) {
    console.error('Axios error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch anime',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ratings/user/{userId}:
 *   get:
 *     summary: Get user ratings via Axios HTTP
 *     description: Delegates to Express MongoDB server using Axios
 */
app.get('/api/ratings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Axios HTTP GET to Express MongoDB server
    const response = await axios.get(`${EXPRESS_DB_URL}/api/ratings/user/${userId}`, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Axios error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch ratings',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/anime/top-rated:
 *   get:
 *     summary: Get top rated anime via Axios
 */
app.get('/api/anime/top-rated', async (req, res) => {
  try {
    // Axios HTTP request to Spring Boot
    const response = await axios.get(`${SPRING_BOOT_URL}/api/anime/top-rated`, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Axios error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch top rated',
      message: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     MAIN SERVER - HTTP/Axios Coordinator       ║
╠════════════════════════════════════════════════╣
║  Protocol:          HTTP                       ║
║  Communication:     Axios                      ║
║  Port:              ${PORT}                        ║
║  Express DB:        ${EXPRESS_DB_URL}         ║
║  Spring Boot:       ${SPRING_BOOT_URL}        ║
║  API Docs:          http://localhost:${PORT}/api-docs ║
╚════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => process.exit(0));
process.on('SIGINT', () => process.exit(0));