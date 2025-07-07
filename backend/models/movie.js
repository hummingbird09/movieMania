const mongoose = require('mongoose');

// Define the Movie Schema
const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true // Remove whitespace from both ends of a string
    },
    description: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    genre: {
        type: [String], // Array of strings for multiple genres
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    trailerUrl: {
        type: String
    },
    // You can add more fields as needed, e.g., cast, director, ratings, etc.
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Create and export the Movie model
module.exports = mongoose.model('Movie', MovieSchema);