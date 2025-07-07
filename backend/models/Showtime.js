// backend/models/Showtime.js

const mongoose = require('mongoose');

// Define the Showtime Schema
const ShowtimeSchema = new mongoose.Schema({
    // Reference to the Movie model
    movie: {
        type: mongoose.Schema.Types.ObjectId, // This is how you link to another model
        ref: 'Movie', // The name of the model it refers to
        required: true
    },
    // Date of the showtime
    date: {
        type: Date,
        required: true
    },
    // Time of the showtime (e.g., "10:00 AM", "01:30 PM")
    // Storing as string for simplicity, can be Date object for complex queries
    time: {
        type: String,
        required: true
    },
    // The specific theater or screen number
    theater: {
        type: String,
        required: true,
        trim: true
    },
    // Total number of seats in this theater for this showtime
    totalSeats: {
        type: Number,
        required: true,
        min: 1 // Must have at least 1 seat
    },
    // Number of available seats (decreases as tickets are booked)
    availableSeats: {
        type: Number,
        required: true,
        min: 0 // Cannot be less than 0
    },
    // Price per ticket for this showtime
    price: {
        type: Number,
        required: true,
        min: 0 // Price cannot be negative
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add an index to prevent duplicate showtimes for the same movie, date, time, and theater
// This ensures uniqueness for a specific showing
ShowtimeSchema.index({ movie: 1, date: 1, time: 1, theater: 1 }, { unique: true });

// Create and export the Showtime model
module.exports = mongoose.model('Showtime', ShowtimeSchema);