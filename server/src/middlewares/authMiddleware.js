// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verify JWT token and attach user to request
const verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.',
      });
    }

    // Correct way to extract token (split and take index 1)
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user (excluding password hash)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token. User not found.',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired. Please login again.',
      });
    }

    return res.status(401).json({
      error: 'Invalid token.',
    });
  }
};

module.exports = { verifyToken };
