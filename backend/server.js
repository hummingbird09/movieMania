// backend/server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const showtimeRoutes = require('./routes/showtimeRoutes');
const bookingRoutes = require('./routes/bookingRoutes'); // Import booking routes

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

connectDB();

// Define a simple route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Use movie routes
app.use('/api/movies', movieRoutes);

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use showtime routes
app.use('/api/showtimes', showtimeRoutes);

// Use booking routes
app.use('/api/bookings', bookingRoutes); // All requests to /api/bookings will be handled by bookingRoutes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
