const jwt = require('jsonwebtoken');
const Log = require('../models/logModel'); // Import the Log model
const cookieParser = require('cookie-parser');

/**
 * Utility function to extract token from cookies
 * @param {object} cookies - The request cookies
 * @returns {string|null} - Extracted token or null
 */
const extractTokenFromCookies = (cookies) => {
  return cookies?.token || null; // Replace 'token' with your cookie's key name if different
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
 */
const authGuard = async (req, res, next) => {
  try {
    const token = extractTokenFromCookies(req.cookies);

    if (!token) {
      await logActivity({
        level: 'warn',
        message: 'Authentication failed: missing token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing',
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
 */
const adminGuard = async (req, res, next) => {
  try {
    const token = extractTokenFromCookies(req.cookies);

    if (!token) {
      await logActivity({
        level: 'warn',
        message: 'Authorization failed: missing token',
        method: req.method,
        url: req.originalUrl,
        user: 'guest',
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing',
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
