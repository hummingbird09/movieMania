// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import User model to find user by ID

// Load environment variables for JWT Secret
require('dotenv').config();

const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request object (without password)
            req.user = await User.findById(decoded.id).select('-password');
            next(); // Continue to the next middleware/route handler

        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    // If no token is provided
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

module.exports = protect;
