const jwt = require('jsonwebtoken');
const Log = require('../models/logModel'); // Import the Log model

/**
 * Utility function to extract token from authorization header
 * @param {string} authHeader - The authorization header
 * @returns {string|null} - Extracted token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader || typeof authHeader !== 'string') return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }

  return null;
};

/**
 * Logs activity to MongoDB
 * @param {object} logData - Data to log
 */
const logActivity = async (logData) => {
  try {
    await Log.create(logData);
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

/**
 * Middleware to handle public routes
 * Logs request details to MongoDB.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
const publicGuard = async (req, res, next) => {
  await logActivity({
    level: 'info',
    message: 'Public route accessed',
    method: req.method,
    url: req.originalUrl,
    user: 'guest',
    ip: req.ip,
  });

  // Set security-related headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  next();
};

/**
 * Middleware to validate authentication
 * Logs authentication activity to MongoDB.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      await logActivity({
        level: 'warn',
        message: 'Authentication failed: missing or invalid token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing or invalid',
      });
    }

    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUserData;

    await logActivity({
      level: 'info',
      message: 'Authentication successful',
      method: req.method,
      url: req.originalUrl,
      user: req.user.id,
      ip: req.ip,
    });

    next();
  } catch (error) {
    await logActivity({
      level: 'error',
      message: 'Authentication error',
      error: error.message,
      method: req.method,
      url: req.originalUrl,
      user: 'guest',
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message:
        error.name === 'JsonWebTokenError'
          ? 'Invalid token'
          : 'Authentication failed',
    });
  }
};

/**
 * Middleware to validate admin access
 * Logs admin access activity to MongoDB.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware function
 */
const adminGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      await logActivity({
        level: 'warn',
        message: 'Authorization failed: missing or invalid token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing or invalid',
      });
    }

    const decodedUserData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedUserData;

    if (!req.user.isAdmin) {
      await logActivity({
        level: 'warn',
        message: 'Permission denied: not an admin',
        method: req.method,
        url: req.originalUrl,
        user: req.user.id,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    await logActivity({
      level: 'info',
      message: 'Admin access granted',
      method: req.method,
      url: req.originalUrl,
      user: req.user.id,
      ip: req.ip,
    });

    next();
  } catch (error) {
    await logActivity({
      level: 'error',
      message: 'Authorization error',
      error: error.message,
      method: req.method,
      url: req.originalUrl,
      user: 'guest',
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message:
        error.name === 'JsonWebTokenError'
          ? 'Invalid token'
          : 'Authorization failed',
    });
  }
};

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined!');
}

module.exports = {
  publicGuard,
  authGuard,
  adminGuard,
};
