// backend/models/Booking.js

const mongoose = require('mongoose');

// Define the Booking Schema
const BookingSchema = new mongoose.Schema({
    // Reference to the User who made the booking
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Reference to the Showtime for which tickets are booked
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    // Number of tickets booked in this transaction
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1 // Must book at least 1 ticket
    },
    // Total price for this booking
    totalPrice: {
        type: Number,
        required: true,
        min: 0 // Price cannot be negative
    },
    // Status of the booking (e.g., 'confirmed', 'pending', 'cancelled')
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed' // Default to confirmed upon creation
    },
    // Date and time when the booking was created
    bookedAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the Booking model
module.exports = mongoose.model('Booking', BookingSchema);