const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { setUserSession, deleteUserSession, blacklistToken } = require('../utils/redis');
const logger = require('../utils/logger');
const HttpError = require('../models/http-error');

// Register new user
exports.register = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username or email already exists.'
      });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      fullName,
      role: 'user' // Default role
    });

    // Generate token
    const token = generateToken(newUser.id);

    // Store session in Redis
    await setUserSession(newUser.id, {
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
      loginTime: new Date()
    });

    // Update last login
    await newUser.update({ lastLogin: new Date() });

    logger.info(`New user registered: ${username}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      data: {
        user: newUser.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    return next(new HttpError('Registration failed. Please try again.', 500));
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email: username }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact administrator.'
      });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Store session in Redis
    await setUserSession(user.id, {
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: new Date()
    });

    // Update last login
    await user.update({ lastLogin: new Date() });

    logger.info(`User logged in: ${username}`);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    return next(new HttpError('Login failed. Please try again.', 500));
  }
};

// Logout user
exports.logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const token = req.token;

    // Delete user session from Redis
    await deleteUserSession(userId);

    // Blacklist the token
    await blacklistToken(token);

    logger.info(`User logged out: ${req.user.username}`);

    res.json({
      success: true,
      message: 'Logout successful.'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    return next(new HttpError('Logout failed. Please try again.', 500));
  }
};

// Get current user
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    return next(new HttpError('Failed to fetch profile.', 500));
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { fullName, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({
        where: { 
          email,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use.'
        });
      }
    }

    // Update user
    const user = await User.findByPk(userId);
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email
    });

    logger.info(`User profile updated: ${user.username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    return next(new HttpError('Failed to update profile.', 500));
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Get user with password
    const user = await User.findByPk(userId);

    // Validate current password
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    // Update password
    await user.update({ password: newPassword });

    // Invalidate all sessions
    await deleteUserSession(userId);

    logger.info(`User password changed: ${user.username}`);

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    return next(new HttpError('Failed to change password.', 500));
  }
};
