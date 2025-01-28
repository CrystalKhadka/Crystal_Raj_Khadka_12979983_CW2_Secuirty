const jwt = require('jsonwebtoken');
const mongoSanitize = require('mongo-sanitize');
const Log = require('../models/logModel');
const cookieParser = require('cookie-parser');

const extractTokenFromCookies = (cookies) => {
  // Replace 'token' with your cookie's key name if different
  return cookies?.token || null;
};

const logActivity = async (logData) => {
  try {
    // Sanitize log data before saving
    await Log.create(mongoSanitize(logData));
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

const publicGuard = async (req, res, next) => {
  // Sanitize incoming data
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);

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

const authGuard = async (req, res, next) => {
  // Sanitize incoming data
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);

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
    // Sanitize decoded user data
    req.user = mongoSanitize(decodedUserData);

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

const adminGuard = async (req, res, next) => {
  // Sanitize incoming data
  req.body = mongoSanitize(req.body);
  req.query = mongoSanitize(req.query);
  req.params = mongoSanitize(req.params);

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
    req.user = mongoSanitize(decodedUserData); // Sanitize decoded user data

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
