// backend/routes/showtimeRoutes.js

const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const mongoose = require('mongoose'); // This import is necessary and remains

// @route   GET /api/showtimes
// @desc    Get all showtimes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const showtimes = await Showtime.find().populate('movie').sort({ date: 1, time: 1 });
        res.json(showtimes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/showtimes/:id
// @desc    Get a single showtime by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie');
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

// @route   GET /api/showtimes/movie/:movieId
// @desc    Get all showtimes for a specific movie
// @access  Public
router.get('/movie/:movieId', async (req, res) => {
    try {
        const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie').sort({ date: 1, time: 1 });
        if (showtimes.length === 0) {
            return res.status(404).json({ msg: 'No showtimes found for this movie' });
        }
        res.json(showtimes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Invalid movie ID format' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/showtimes
// @desc    Add a new showtime
// @access  Private (Admin only - will add auth middleware later)
router.post('/', async (req, res) => {
    // Reverted: Now expects totalSeats again
    const { movie, date, time, theater, totalSeats, price } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(movie)) {
            return res.status(400).json({ msg: 'Invalid Movie ID format' });
        }

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
            availableSeats: totalSeats, // Initially, available seats are equal to total seats
            price
        });

        const showtime = await newShowtime.save();
        await showtime.populate('movie');
        res.status(201).json(showtime);

    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'A showtime for this movie, date, time, and theater already exists.' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/showtimes/:id
// @desc    Update an existing showtime
// @access  Private (Admin only)
router.put('/:id', async (req, res) => {
    // Reverted: totalSeats and availableSeats are now directly updatable
    const { movie, date, time, theater, totalSeats, availableSeats, price } = req.body;

    const showtimeFields = {};
    if (movie) showtimeFields.movie = movie;
    if (date) showtimeFields.date = date;
    if (time) showtimeFields.time = time;
    if (theater) showtimeFields.theater = theater;
    if (totalSeats) showtimeFields.totalSeats = totalSeats;
    if (availableSeats !== undefined) { // Check for undefined to allow 0
        showtimeFields.availableSeats = availableSeats;
    } else if (totalSeats && totalSeats !== undefined) {
        // This logic might need refinement based on how you want to handle seat updates
        // For now, if totalSeats changes and availableSeats is not provided, we don't auto-adjust availableSeats
    }
    if (price) showtimeFields.price = price;

    try {
        let showtime = await Showtime.findById(req.params.id);
        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found' });
        }

        if (showtimeFields.movie && showtimeFields.movie.toString() !== showtime.movie.toString()) {
            return res.status(400).json({ msg: 'Cannot change movie for an existing showtime.' });
        }

        // If totalSeats is updated, ensure availableSeats doesn't exceed new totalSeats
        if (showtimeFields.totalSeats && showtimeFields.totalSeats < showtime.availableSeats) {
             return res.status(400).json({ msg: 'Total seats cannot be less than currently available seats.' });
        }

        showtime = await Showtime.findByIdAndUpdate(
            req.params.id,
            { $set: showtimeFields },
            { new: true, runValidators: true }
        ).populate('movie');

        res.json(showtime);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'A showtime for this movie, date, time, and theater already exists.' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/showtimes/:id
// @desc    Delete a showtime
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if (!showtime) {
            return res.status(404).json({ msg: 'Showtime not found' });
        }
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