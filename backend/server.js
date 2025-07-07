// backend/server.js

    const express = require('express');
    const connectDB = require('./config/db');
    const dotenv = require('dotenv');
    const cors = require('cors');
    const path = require('path');

    // Load env vars
    dotenv.config({ path: './config/config.env' }); // Assuming config.env in config folder
    // If your .env is directly in backend folder:
    dotenv.config();

    const app = express();

    // Connect to database
    connectDB();

    // TEMPORARY: Import and run seeding script ONLY ONCE for deployment
    // REMOVE THESE LINES AFTER SUCCESSFUL DEPLOYMENT AND SEEDING
    const seedMovies = require('./seedMovies');
    seedMovies();
    // END TEMPORARY BLOCK

    // Init middleware
    app.use(express.json({ extended: false }));
    app.use(cors());

    // Define Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/movies', require('./routes/movieRoutes'));
    app.use('/api/showtimes', require('./routes/showtimeRoutes'));
    app.use('/api/bookings', require('./routes/bookingRoutes'));

    // Serve static assets in production
    if (process.env.NODE_ENV === 'production') {
        // Set static folder
        app.use(express.static(path.join(__dirname, '../frontend/build')));

        app.get('*', (req, res) =>
            res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
        );
    } else {
        app.get('/', (req, res) => {
            res.send('API is running...');
        });
    }


    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    