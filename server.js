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

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  console.log('Server will continue without MongoDB');
});

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express MongoDB Server API',
      version: '1.0.0',
      description: 'MongoDB server for dynamic data'
    },
    servers: [{ url: 'http://localhost:' + PORT }]
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'Express MongoDB server running',
    port: PORT,
    protocol: 'HTTP',
    database: { status: dbStatus },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ratings/anime/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    res.json({
      animeId: parseInt(animeId),
      averageRating: 8.5,
      totalRatings: 1234,
      message: 'MongoDB data via HTTP'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

app.get('/api/ratings/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    res.json({
      userId,
      totalRatings: 45,
      averageRating: 7.8,
      message: 'MongoDB data via HTTP'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   EXPRESS MONGODB SERVER - HTTP/Axios          ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log('║  Port:              ' + PORT + '                       ║');
  console.log('║  API Docs:          http://localhost:' + PORT + '/api-docs ║');
  console.log('╚════════════════════════════════════════════════╝\n');
});