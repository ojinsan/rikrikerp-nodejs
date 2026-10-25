const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

// Import configurations and utilities
const config = require('./config/config');
const logger = require('./utils/logger');
const sequelize = require('./util/database');
const databaseRelation = require('./util/database-relation');

// Import routes
const authRoute = require('./routes/auth-route');
const datasourceRoute = require('./routes/datasource-route');
const baseRoute = require('./routes/base-route');
const projectRoute = require('./routes/project-route');
const excelRoute = require('./routes/excel-route');

// Import middleware
const { verifyToken, authorize } = require('./middleware/auth');
const HttpError = require('./models/http-error');

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors(config.cors));

// Request logging
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// API version prefix
const API_PREFIX = '/api/v1';

// Public routes (no authentication required)
app.use(`${API_PREFIX}/auth`, authRoute);

// Protected routes (authentication required)
app.use(`${API_PREFIX}/project`, verifyToken, projectRoute);
app.use(`${API_PREFIX}/data-source`, verifyToken, datasourceRoute);
app.use(`${API_PREFIX}/base`, verifyToken, baseRoute);
app.use(`${API_PREFIX}/excel`, verifyToken, authorize('admin', 'user'), excelRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: config.app.name,
    version: config.app.version,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res, next) => {
  const error = new HttpError('Route not found', 404);
  throw error;
});

// Global error handler
app.use((error, req, res, next) => {
  // Log error
  logger.error('Global error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    success: false,
    message: error.message || 'An unknown error occurred',
    ...(config.nodeEnv === 'development' && { stack: error.stack })
  });
});

// Initialize database relations
databaseRelation();

// Start server
const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: config.nodeEnv === 'development' });
    logger.info('Database synchronized successfully');

    // Start listening
    app.listen(config.port, () => {
      logger.info(`🚀 ${config.app.name} v${config.app.version} is running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

module.exports = app;
