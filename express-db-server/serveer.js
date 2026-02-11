/**
 * Express MongoDB Server - HTTP/Axios Communication
 * 
 * Handles dynamic anime data (ratings, profiles, recommendations, favs)
 * Communicates via HTTP protocol, receives Axios requests
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/anime_db';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✓ Connected to MongoDB');
})
.catch((error) => {
  console.error('✗ MongoDB connection error:', error.message);
  process.exit(1);
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express MongoDB Server API',
      version: '1.0.0',
      description: 'MongoDB server for dynamic data - receives HTTP/Axios requests'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./server.js', './models/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns server and MongoDB status
 */
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({
    status: 'Express MongoDB server running',
    port: PORT,
    protocol: 'HTTP',
    communication: 'Receives Axios requests',
    database: {
      status: dbStatus,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/ratings/anime/{animeId}:
 *   get:
 *     summary: Get ratings for anime
 *     description: Retrieves ratings from MongoDB (called via Axios from main server)
 */
app.get('/api/ratings/anime/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    
    // TODO: Query MongoDB when models are created
    // For now, return mock data to test HTTP/Axios communication
    res.json({
      animeId: parseInt(animeId),
      averageRating: 8.5,
      totalRatings: 1234,
      ratings: [
        { userId: 'user1', rating: 9, date: '2024-01-15' },
        { userId: 'user2', rating: 8, date: '2024-01-20' }
      ],
      message: 'Data from MongoDB via HTTP'
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({
      error: 'Failed to fetch ratings',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/ratings/user/{userId}:
 *   get:
 *     summary: Get user ratings
 *     description: Receives HTTP request via Axios from main server
 */
app.get('/api/ratings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Query MongoDB
    res.json({
      userId,
      totalRatings: 45,
      averageRating: 7.8,
      ratings: [
        { animeId: 1, title: 'Naruto', rating: 9, date: '2024-01-10' },
        { animeId: 5, title: 'One Piece', rating: 10, date: '2024-01-15' }
      ],
      message: 'MongoDB data via HTTP/Axios'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to fetch user ratings',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     summary: Get user profile
 */
app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Query MongoDB profiles collection
    res.json({
      userId,
      username: 'AnimeWatcher123',
      joinedDate: '2020-05-15',
      watching: 12,
      completed: 89,
      favorites: 15,
      image: 'https://i.pravatar.cc/150?u=' + userId,
      message: 'Profile from MongoDB via HTTP'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/recommendations/anime/{animeId}:
 *   get:
 *     summary: Get recommendations
 */
app.get('/api/recommendations/anime/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    
    // TODO: Query MongoDB recommendations
    res.json({
      animeId: parseInt(animeId),
      recommendations: [
        { animeId: 101, title: 'Attack on Titan', score: 9.0, votes: 450 },
        { animeId: 102, title: 'Death Note', score: 8.8, votes: 380 }
      ],
      message: 'Recommendations via HTTP/Axios'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch recommendations',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/favorites/user/{userId}:
 *   get:
 *     summary: Get user favorites
 */
app.get('/api/favorites/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // TODO: Query MongoDB favs collection
    res.json({
      userId,
      totalFavorites: 8,
      favorites: [
        { animeId: 1, title: 'Fullmetal Alchemist', addedDate: '2023-05-10' },
        { animeId: 20, title: 'Steins;Gate', addedDate: '2023-06-15' }
      ],
      message: 'Favorites from MongoDB via HTTP'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch favorites',
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
║   EXPRESS MONGODB SERVER - HTTP/Axios          ║
╠════════════════════════════════════════════════╣
║  Protocol:          HTTP                       ║
║  Receives:          Axios requests             ║
║  Port:              ${PORT}                        ║
║  Database:          MongoDB (anime_db)         ║
║  API Docs:          http://localhost:${PORT}/api-docs ║
╚════════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});