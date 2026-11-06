const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.onrender.com') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      } else {
        return callback(new Error('CORS policy: This origin is not allowed'));
      }
    },
    credentials: true,
  })
);

// Health Check Endpoint (Render & Monitoring)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    platform: 'Annadaan Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Serve Frontend in Production if built
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  // Prevent express.static from automatically intercepting root / so API check can answer
  app.use(express.static(frontendDist, { index: false }));

  app.get('/', (req, res, next) => {
    const isBrowserHtml = req.headers.accept && req.headers.accept.includes('text/html');
    if (!isBrowserHtml) {
      return res.status(200).json({
        status: 'online',
        platform: 'Annadaan - Smart Waste Food Management & Donation Platform API',
        version: '1.0.0',
        documentation: {
          auth: '/api/auth',
          donations: '/api/donations',
          stats: '/api/stats',
          health: '/api/health',
        },
      });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Base API Health Check for standalone backend
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'online',
      platform: 'Annadaan - Smart Waste Food Management & Donation Platform API',
      version: '1.0.0',
      documentation: {
        auth: '/api/auth',
        donations: '/api/donations',
        stats: '/api/stats',
        health: '/api/health',
      },
    });
  });
}

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Annadaan Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
