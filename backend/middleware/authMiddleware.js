const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token for protected endpoints
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'learnhub_batch3_jwt_secret_key_2026'
      );

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User account no longer exists' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token provided' });
};

// Optional auth middleware: allows flexible course creation if unauthenticated,
// while strictly enforcing role permissions when a token is provided
const optionalCourseAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'learnhub_batch3_jwt_secret_key_2026'
      );
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      if (user.role === 'student') {
        return res.status(403).json({
          message: 'Access denied: Students cannot create or modify courses',
        });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }
  next();
};

// Restrict access to specific user roles (e.g., 'admin', 'instructor', 'student')
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role (${req.user ? req.user.role : 'guest'}) is not permitted to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalCourseAuth, authorizeRoles };
