// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Load environment variables for JWT Secret
require('dotenv').config();

// Generate a JWT token
const generateToken = (id) => {
    // Sign the token with the user's ID and the JWT_SECRET from environment variables
    // The token expires in 1 hour (3600 seconds)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if a user with the given email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User with that email already exists' });
        }

        // Check if a user with the given username already exists
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User with that username already exists' });
        }

        // Create a new user instance
        user = new User({
            username,
            email,
            password, // Password will be hashed by the pre-save hook in the User model
            role: role || 'user' // Set role, default to 'user' if not provided
        });

        // Save the user to the database
        await user.save();

        // Generate a token for the newly registered user
        const token = generateToken(user._id);

        // Send back user data and token
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
        });

    } catch (err) {
        console.error(err.message);
        // Handle validation errors (e.g., if email format is invalid)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a user with the given email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Use generic message for security
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' }); // Use generic message for security
        }

        // Generate a token for the logged-in user
        const token = generateToken(user._id);

        // Send back user data and token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;