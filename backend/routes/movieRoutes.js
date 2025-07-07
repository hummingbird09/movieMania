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
    const { showtimeId, selectedSeats } = req.body; // Now expects selectedSeats array

    try {
        // 1. Validate showtimeId and selectedSeats
        if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
            return res.status(400).json({ msg: 'Invalid Showtime ID format' });
        }
        if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({ msg: 'Please select at least one seat.' });
        }

        // 2. Find the showtime
        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found.' });
        }

        // 3. Check seat availability and mark them as booked
        const seatsToBook = [];
        const bookedSeatNumbers = []; // To store the actual seat numbers booked

        for (const seatNumber of selectedSeats) {
            const seat = showtime.seats.find(s => s.seatNumber === seatNumber);
            if (!seat) {
                return res.status(400).json({ msg: `Seat ${seatNumber} does not exist for this showtime.` });
            }
            if (seat.isBooked) {
                return res.status(400).json({ msg: `Seat ${seatNumber} is already booked.` });
            }
            seatsToBook.push(seat);
            bookedSeatNumbers.push(seatNumber); // Collect seat numbers for the booking record
        }

        // Mark seats as booked in the showtime document
        seatsToBook.forEach(seat => {
            seat.isBooked = true;
        });

        // 4. Calculate total price
        const numberOfTickets = selectedSeats.length;
        const totalPrice = numberOfTickets * showtime.price;

        // 5. Create the booking
        const newBooking = new Booking({
            user: req.user.id,
            showtime: showtimeId,
            numberOfTickets,
            totalPrice,
            bookedSeats: bookedSeatNumbers, // Store the specific seat numbers booked
            status: 'confirmed'
        });

        const booking = await newBooking.save();

        // 6. Save the updated showtime (with seats marked as booked)
        await showtime.save();

        // Populate details for the response
        await booking.populate({
            path: 'showtime',
            populate: { path: 'movie' }
        });

        res.status(201).json(booking);

    } catch (err) {
        console.error(err.message);
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

        // Find the associated showtime to release seats
        const showtime = await Showtime.findById(booking.showtime);
        if (showtime && booking.bookedSeats && booking.bookedSeats.length > 0) {
            // Mark specific seats as unbooked
            booking.bookedSeats.forEach(bookedSeatNumber => {
                const seat = showtime.seats.find(s => s.seatNumber === bookedSeatNumber);
                if (seat) {
                    seat.isBooked = false;
                }
            });
            await showtime.save(); // Save the updated showtime with released seats
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