const jwt = require('jsonwebtoken');
const User = require('../models/User')

const authenticate = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
  
    try {
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
  
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      next();
      
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
  
// Authorize middleware: Restricts access based on user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role ${req.user.role} is not authorized to access this route`,
      });
    }

    next(); // Proceed to the next middleware
  };
};

module.exports = { authenticate, authorize };
