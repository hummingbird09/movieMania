// backend/routes/movieRoutes.js

const express = require('express');
const router = express.Router();
const Movie = require('../models/movie'); // Changed 'Movie' to 'movie' (lowercase)
const auth = require('../middleware/authMiddleware');

// @route   GET api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/movies/:id
// @desc    Get movie by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.status(500).send('Server Error');
    }
});


// @route   POST api/movies
// @desc    Add new movie
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    const { title, description, releaseDate, genre, duration, posterUrl, trailerUrl } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    try {
        const newMovie = new Movie({
            title,
            description,
            releaseDate,
            genre,
            duration,
            posterUrl,
            trailerUrl
        });

        const movie = await newMovie.save();
        res.status(201).json(movie);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/movies/:id
// @desc    Update a movie
// @access  Private (Admin only)
router.put('/:id', auth, async (req, res) => {
    const { title, description, releaseDate, genre, duration, posterUrl, trailerUrl } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    // Build movie object
    const movieFields = {};
    if (title) movieFields.title = title;
    if (description) movieFields.description = description;
    if (releaseDate) movieFields.releaseDate = releaseDate;
    if (genre) movieFields.genre = genre;
    if (duration) movieFields.duration = duration;
    if (posterUrl) movieFields.posterUrl = posterUrl;
    if (trailerUrl) movieFields.trailerUrl = trailerUrl;

    try {
        let movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(404).json({ msg: 'Movie not found' });

        movie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: movieFields },
            { new: true }
        );

        res.json(movie);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/movies/:id
// @desc    Delete a movie
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({ msg: 'Movie not found' });
        }

        await Movie.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

        res.json({ msg: 'Movie removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Movie not found' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
