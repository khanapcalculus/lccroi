const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tutors', require('./routes/tutorRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/matching', require('./routes/matchingRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'LCC 360 Tutor Resource Optimization System API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Serve React frontend in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Any route that is not an API route serves the React app
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Root route for development
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to LCC 360 API',
      endpoints: {
        tutors: '/api/tutors',
        students: '/api/students',
        matching: '/api/matching',
        config: '/api/config',
        health: '/api/health'
      }
    });
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        LCC 360 Tutor Resource Optimization System          ║
║                                                            ║
║  Server running on port ${PORT}                            ║
║  Environment: ${process.env.NODE_ENV || 'development'}                               ║
║                                                            ║
║  API Endpoints:                                            ║
║  - GET  /api/health                                        ║
║  - GET  /api/tutors                                        ║
║  - POST /api/tutors                                        ║
║  - GET  /api/students                                      ║
║  - POST /api/students                                      ║
║  - POST /api/matching/find-match                           ║
║  - GET  /api/matching/recommendations                      ║
║  - GET  /api/matching/projected-revenue                    ║
║  - GET  /api/config/weights                                ║
║  - PUT  /api/config/weights                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
