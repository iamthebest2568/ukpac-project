/**
 * Authentication Routes
 * Handles login and JWT token generation
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Input validation middleware
const validateLogin = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username is required')
    .escape(),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

/**
 * POST /api/v1/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid input',
        details: errors.array(),
        timestamp: new Date().toISOString()
      });
    }

    const { username, password } = req.body;

    // Validate credentials against environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'alex';
    const validPassword = process.env.ADMIN_PASSWORD || 'Geetr2526Ur!';

    if (username !== validUsername || password !== validPassword) {
      // Log failed attempt (in production, implement proper logging)
      console.log(`Failed login attempt for username: ${username} at ${new Date().toISOString()}`);
      
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect',
        timestamp: new Date().toISOString()
      });
    }

    // Generate JWT token
    const tokenPayload = {
      username: username,
      role: 'admin',
      loginTime: Date.now()
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
        issuer: 'uk-pack-dashboard',
        audience: 'uk-pack-admin'
      }
    );

    // Log successful login
    console.log(`Successful login for username: ${username} at ${new Date().toISOString()}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      token: token,
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      user: {
        username: username,
        role: 'admin'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during authentication',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/v1/auth/verify
 * Verify JWT token validity
 */
router.post('/verify', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Authorization header must be provided with Bearer token',
        timestamp: new Date().toISOString()
      });
    }

    const token = authHeader.substring(7);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token is invalid or expired',
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: {
          username: decoded.username,
          role: decoded.role
        },
        timestamp: new Date().toISOString()
      });
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during token verification',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout endpoint (token invalidation would be handled client-side)
 */
router.post('/logout', (req, res) => {
  // In a production environment, you might want to maintain a blacklist of tokens
  // For this implementation, we'll just return a success response
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
