// file: backend/src/middleware/authMiddleware.js (or auth.middleware.js)

import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import the User model

/**
 * Protect routes by verifying JWT token and fetching user data.
 * Attaches the authenticated user object to req.user.
 */
export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // 1. Extract token
      token = authHeader.split(' ')[1];

      // 2. Verify token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user from database using ID from token (Security Enhancement)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Token failed or expired' });
    }
  } else if (!authHeader) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
  } else {
    res.status(401).json({ message: 'Token format incorrect' });
  }
};