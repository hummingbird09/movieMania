// backend/routes/bookingRoutes.js

// backend/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const auth = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private (requires authentication)
router.post('/', auth, async (req, res) => {
    // Reverted: Now expects numberOfTickets
    const { showtimeId, numberOfTickets } = req.body;

    try {
        // 1. Validate showtimeId and numberOfTickets
        if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
            return res.status(400).json({ msg: 'Invalid Showtime ID format' });
        }
        if (typeof numberOfTickets !== 'number' || numberOfTickets < 1) {
            return res.status(400).json({ msg: 'Number of tickets must be a positive number.' });
        }

        // 2. Find the showtime and check availability
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found.' });
        }

        if (showtime.availableSeats < numberOfTickets) {
            return res.status(400).json({ msg: `Not enough seats available. Only ${showtime.availableSeats} seats left.` });
        }

        // 3. Calculate total price
        const totalPrice = numberOfTickets * showtime.price;

        // 4. Create the booking
        const newBooking = new Booking({
            user: req.user.id, // User ID from authenticated request
            showtime: showtimeId,
            numberOfTickets,
            totalPrice,
            status: 'confirmed' // Default status
        });

        const booking = await newBooking.save();

        // 5. Update available seats in the showtime
        showtime.availableSeats -= numberOfTickets;
        await showtime.save();

        // Populate the showtime and movie details for the response
        await booking.populate({
            path: 'showtime',
            populate: { path: 'movie' }
        });

        res.status(201).json(booking);

    } catch (err) {
        console.error(err.message);
        // Handle validation errors or other specific errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/bookings/mybookings
// @desc    Get all bookings for the authenticated user
// @access  Private (requires authentication)
router.get('/mybookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            })
            .sort({ bookedAt: -1 });

        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/bookings/:id
// @desc    Get a single booking by ID (for authenticated user)
// @access  Private (requires authentication)
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id })
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            });

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found or you do not have access to it.' });
        }
        res.json(booking);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Booking not found.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking (and release seats)
// @access  Private (requires authentication)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found or you do not have access to it.' });
        }

        // Find the associated showtime to return seats
        const showtime = await Showtime.findById(booking.showtime);
        if (showtime) {
            showtime.availableSeats += booking.numberOfTickets; // Reverted: Add back number of tickets
            await showtime.save();
        }

        await booking.deleteOne();

        res.json({ msg: 'Booking cancelled successfully.' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Booking not found.' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;