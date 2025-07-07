// backend/seedMovies.js

const axios = require('axios'); // Import axios for making HTTP requests

// Array of movie data to be inserted
const moviesToSeed = [
    {
        title: "Oldboy",
        description: "After being kidnapped and imprisoned for 15 years, Oh Dae-Su is released, only to find that he must uncover the truth behind his captivity in five days.",
        releaseDate: "2003-11-21T00:00:00.000Z", // Ensure ISO format for Date
        genre: ["Action", "Drama", "Thriller"],
        duration: 120,
        posterUrl: "https://image.tmdb.org/t/p/w500/rIZX6X0MIHYEebk6W4LABT9VP2c.jpg",
        trailerUrl: "" // No trailer URL provided, so keep it empty or remove if not required by schema
    },
    {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        releaseDate: "2010-07-16T00:00:00.000Z",
        genre: ["Action", "Sci-Fi", "Thriller"],
        duration: 148,
        posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        trailerUrl: ""
    },
    {
        title: "Jab We Met",
        description: "A depressed businessman finds his life changing after he meets a spirited, free-spirited woman on a train journey.",
        releaseDate: "2007-10-26T00:00:00.000Z",
        genre: ["Comedy", "Drama", "Romance"],
        duration: 138,
        posterUrl: "https://image.tmdb.org/t/p/w500/lgCFw6V0YpO4UYbwLXk1mQv4vVd.jpg",
        trailerUrl: ""
    },
    {
        title: "Annabelle",
        description: "A couple begins to experience terrifying supernatural occurrences involving a vintage doll shortly after their home is invaded by satanic cultists.",
        releaseDate: "2014-10-03T00:00:00.000Z",
        genre: ["Horror", "Thriller"],
        duration: 99,
        posterUrl: "https://image.tmdb.org/t/p/w500/dkMDVq5UaGFO0o6c3QY9ZFI51EC.jpg",
        trailerUrl: ""
    },
    {
        title: "Schindler's List",
        description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
        releaseDate: "1993-12-15T00:00:00.000Z",
        genre: ["Biography", "Drama", "History"],
        duration: 195,
        posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4vkFh wherever you are.jpg", // Using a common poster URL from search
        trailerUrl: "https://www.youtube.com/watch?v=gG22XNhtSgA"
    },
    {
        title: "Dandadan",
        description: "Two teenagers, Momo Ayase and Ken Takakura, find themselves entangled in a supernatural battle against aliens and spirits, leading to bizarre and comedic adventures.",
        releaseDate: "2024-10-04T00:00:00.000Z", // Assuming a future release date for the anime series
        genre: ["Action", "Comedy", "Supernatural"],
        duration: 130, // Assuming typical anime episode duration
        posterUrl: "https://image.tmdb.org/t/p/w500/xVq2j2E6U3wQ1i9Z4k0X6Z2Q7uM.jpg", // Using a common poster URL from search
        trailerUrl: "https://www.youtube.com/watch?v=Fj2s_J-1u4U"
    }
];

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api/movies';

// Function to seed movies
const seedMovies = async () => {
    console.log('Starting movie seeding process...');
    for (const movie of moviesToSeed) {
        try {
            const response = await axios.post(API_URL, movie);
            console.log(`Successfully added movie: ${response.data.title}`);
        } catch (error) {
            console.error(`Failed to add movie: ${movie.title}. Error:`,
                error.response ? error.response.data.msg || error.response.data : error.message);
        }
    }
    console.log('Movie seeding process completed.');
};

// Execute the seeding function
seedMovies();