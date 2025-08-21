/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and protect routes
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and has correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authorization header with Bearer token is required',
        timestamp: new Date().toISOString()
      });
    }

    // Extract token from header
    const token = authHeader.substring(7);

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        let message = 'Invalid or expired token';
        
        if (err.name === 'TokenExpiredError') {
          message = 'Token has expired';
        } else if (err.name === 'JsonWebTokenError') {
          message = 'Invalid token format';
        } else if (err.name === 'NotBeforeError') {
          message = 'Token not active yet';
        }

        return res.status(401).json({
          error: 'Authentication failed',
          message: message,
          timestamp: new Date().toISOString()
        });
      }

      // Add user information to request object
      req.user = {
        username: decoded.username,
        role: decoded.role,
        loginTime: decoded.loginTime
      };

      // Continue to next middleware/route handler
      next();
    });

  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during authentication',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access forbidden',
      message: 'Admin role required for this operation',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err && decoded) {
      req.user = {
        username: decoded.username,
        role: decoded.role,
        loginTime: decoded.loginTime
      };
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
