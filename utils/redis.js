const redis = require('redis');
const config = require('../config/config');
const logger = require('./logger');

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  password: config.redis.password || undefined,
  database: config.redis.db
});

// Handle Redis events
redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
  }
})();

// Helper functions for Redis operations
const redisHelpers = {
  // Set key with expiration
  async setWithExpiry(key, value, expirySeconds = 86400) { // Default 24 hours
    try {
      await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Redis setWithExpiry error:', error);
      return false;
    }
  },

  // Get value by key
  async get(key) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  },

  // Delete key
  async delete(key) {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  },

  // Check if key exists
  async exists(key) {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists error:', error);
      return false;
    }
  },

  // Set user session
  async setUserSession(userId, sessionData, expirySeconds = 604800) { // Default 7 days
    const key = `session:${userId}`;
    return await this.setWithExpiry(key, sessionData, expirySeconds);
  },

  // Get user session
  async getUserSession(userId) {
    const key = `session:${userId}`;
    return await this.get(key);
  },

  // Delete user session
  async deleteUserSession(userId) {
    const key = `session:${userId}`;
    return await this.delete(key);
  },

  // Blacklist JWT token
  async blacklistToken(token, expirySeconds = 604800) { // Default 7 days
    const key = `blacklist:${token}`;
    return await this.setWithExpiry(key, { blacklisted: true }, expirySeconds);
  },

  // Check if token is blacklisted
  async isTokenBlacklisted(token) {
    const key = `blacklist:${token}`;
    return await this.exists(key);
  }
};

module.exports = {
  redisClient,
  ...redisHelpers
};
