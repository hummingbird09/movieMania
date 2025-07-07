// backend/routes/showtimeRoutes.js

const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');
const Movie = require('../models/movie'); // Changed 'Movie' to 'movie' (lowercase)
const auth = require('../middleware/authMiddleware');

// @route   GET api/showtimes
// @desc    Get all showtimes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const showtimes = await Showtime.find().populate('movie', ['title', 'posterUrl', 'duration', 'genre', 'description', 'trailerUrl']);
        res.json(showtimes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/showtimes/:id
// @desc    Get showtime by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie', ['title', 'posterUrl', 'duration', 'genre', 'description', 'trailerUrl']);
        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
        res.json(showtime);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/showtimes
// @desc    Add new showtime
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    const { movie, date, time, theater, totalSeats, price } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    try {
        // Validate movie ID
        const existingMovie = await Movie.findById(movie);
        if (!existingMovie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }

        const newShowtime = new Showtime({
            movie,
            date,
            time,
            theater,
            totalSeats,
            availableSeats: totalSeats, // Initially, all seats are available
            price
        });

        const showtime = await newShowtime.save();
        res.status(201).json(showtime);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/showtimes/:id
// @desc    Update a showtime
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    const { movie, date, time, theater, totalSeats, price } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const showtimeFields = {};
    if (movie) showtimeFields.movie = movie;
    if (date) showtimeFields.date = date;
    if (time) showtimeFields.time = time;
    if (theater) showtimeFields.theater = theater;
    if (totalSeats) {
        showtimeFields.totalSeats = totalSeats;
        // When totalSeats is updated, also update availableSeats if needed
        // This logic might need refinement based on actual booking status
        // For simplicity, we'll assume availableSeats is reset to totalSeats on update
        showtimeFields.availableSeats = totalSeats;
    }
    if (price) showtimeFields.price = price;


    try {
        let showtime = await Showtime.findById(req.params.id);

        if (!showtime) return res.status(404).json({ msg: 'Showtime not found' });

        showtime = await Showtime.findByIdAndUpdate(
            req.params.id,
            { $set: showtimeFields },
            { new: true }
        );

        res.json(showtime);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/showtimes/:id
// @desc    Delete a showtime
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    try {
        const showtime = await Showtime.findById(req.params.id);

        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found' });
        }

        await Showtime.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

        res.json({ msg: 'Showtime removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;