// frontend/src/App.js

import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import MovieForm from './components/movieForm';
import ShowtimeForm from './components/ShowtimeForm';
import Register from './components/Register';
import Login from './components/Login';
import ShowtimeCard from './components/ShowtimeCard';
import MyBookings from './components/MyBookings';
import Navbar from './components/Navbar';
import { AuthContext, AuthProvider } from './context/AuthContext';
import './App.css';

// Main App component wrapped with AuthProvider
function AppContent() {
  const { user, loading: authLoading, token } = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('movies');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  // Function to fetch all movies
  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to fetch movies from the backend.');
      setMovies([]);
    }
  }, []);

  // Function to fetch all showtimes
  const fetchShowtimes = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/showtimes');
      setShowtimes(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching showtimes:', err);
      setError('Failed to fetch showtimes from the backend.');
      setShowtimes([]);
    }
  }, []);

  // Handle booking tickets
  const handleBooking = async (showtimeId, numberOfTickets) => {
    setBookingMessage('');
    setBookingError('');

    if (!user || !token) {
      setBookingError('You must be logged in to book tickets.');
      setCurrentPage('login');
      return;
    }
    if (numberOfTickets < 1) {
      setBookingError('Please enter a valid number of tickets (at least 1).');
      return;
    }
    const targetShowtime = showtimes.find(st => st._id === showtimeId);
    if (!targetShowtime) {
        setBookingError('Showtime not found on frontend. Please refresh.');
        return;
    }
    if (numberOfTickets > targetShowtime.availableSeats) {
        setBookingError(`Cannot book ${numberOfTickets} tickets. Only ${targetShowtime.availableSeats} seats available.`);
        return;
    }


    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const res = await axios.post('http://localhost:5000/api/bookings', { showtimeId, numberOfTickets }, config);

      setBookingMessage(`🎉 Success! Booked ${res.data.numberOfTickets} tickets for "${res.data.showtime.movie.title}" at ${res.data.showtime.time} on ${new Date(res.data.showtime.date).toLocaleDateString()}. Total: ₹${res.data.totalPrice.toFixed(2)}`);
      setBookingError('');
      console.log('Booking successful:', res.data);

      fetchShowtimes();

      setTimeout(() => {
        setBookingMessage('');
      }, 5000);

    } catch (err) {
      console.error('Booking error:', err.response ? err.response.data : err.message);
      setBookingError(err.response && err.response.data && err.response.data.msg
        ? err.response.data.msg
        : 'Failed to book tickets. Please try again.');
      setBookingMessage('');
    }
  };


  useEffect(() => {
    const fetchBackendMessage = async () => {
      try {
        const response = await axios.get('http://localhost:5000/');
        setMessage(response.data);
      } catch (err) {
        console.error('Error fetching backend message:', err);
        setError('Failed to connect to backend API. Is the backend server running?');
      }
    };

    fetchBackendMessage();
    fetchMovies();
    fetchShowtimes();
  }, [fetchMovies, fetchShowtimes]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  // Group showtimes by movie ID for easier rendering
  const showtimesByMovie = showtimes.reduce((acc, showtime) => {
    if (showtime.movie && showtime.movie._id) {
      if (!acc[showtime.movie._id]) {
        acc[showtime.movie._id] = [];
      }
      acc[showtime.movie._id].push(showtime);
    }
    return acc;
  }, {});

  // Filter movies based on search term
  const filteredMovies = searchTerm
    ? movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : movies;


  // Function to render the current page content
  const renderPage = () => {
    if (!user) {
      return currentPage === 'register' ? (
        <Register onSwitchToLogin={() => setCurrentPage('login')} />
      ) : (
        <Login onSwitchToRegister={() => setCurrentPage('register')} />
      );
    } else {
      switch (currentPage) {
        case 'movies':
          return (
            <>
              {user.role === 'admin' && (
                <>
                  <MovieForm onMovieAdded={fetchMovies} />
                  <ShowtimeForm onShowtimeAdded={fetchShowtimes} />
                </>
              )}

              <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-wide drop-shadow-lg">Available Movies</h2>

              {/* Movie Search Input */}
              <div className="mb-10 flex justify-center">
                <input
                  type="text"
                  placeholder="Search movies by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-md px-5 py-2.5 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/80 backdrop-blur-md text-gray-800 placeholder-gray-500 text-lg"
                />
              </div>

              {filteredMovies.length === 0 && !error ? (
                <p className="text-white text-center text-xl mt-10 bg-black/60 p-6 rounded-lg shadow-xl backdrop-blur-sm">
                  {searchTerm ? `No movies found matching "${searchTerm}".` : 'No movies found. Please add some using the form above (if you are an admin)!'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredMovies.map((movie) => (
                    <div key={movie._id} className="bg-white/80 rounded-2xl shadow-2xl p-6 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-3xl backdrop-blur-md border border-gray-200">
                      {movie.posterUrl && (
                          <div className="mb-5 rounded-lg overflow-hidden border border-gray-300 shadow-md">
                              <img
                                  src={movie.posterUrl}
                                  alt={`${movie.title} Poster`}
                                  className="w-full h-auto object-cover rounded-lg"
                                  onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://placehold.co/500x750/cccccc/333333?text=No+Poster`;
                                  }}
                              />
                          </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-purple-800 mb-2">{movie.title}</h3>
                        <p className="text-gray-700 mb-3 text-sm leading-relaxed">{movie.description}</p>
                        <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Release Date:</span> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Genre:</span> {movie.genre.join(', ')}</p>
                        <p className="text-gray-600 text-sm mb-1"><span className="font-semibold">Duration:</span> {movie.duration} minutes</p>
                      </div>

                      {showtimesByMovie[movie._id] && showtimesByMovie[movie._id].length > 0 && (
                        <div className="mt-5 pt-5 border-t border-gray-300">
                          <h4 className="text-xl font-semibold text-gray-800 mb-3">Showtimes:</h4>
                          <div className="space-y-3">
                            {showtimesByMovie[movie._id].map((showtime) => (
                              <ShowtimeCard
                                key={showtime._id}
                                showtime={showtime}
                                onBookTickets={handleBooking}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {movie.trailerUrl && (
                        <div className="mt-auto pt-5 border-t border-gray-300">
                          <p className="text-gray-700 text-sm">
                            <span className="font-semibold">Trailer:</span> <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium hover:text-blue-800 transition duration-150 ease-in-out">Watch Trailer</a>
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        case 'mybookings':
          return <MyBookings />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="App relative min-h-screen overflow-hidden">
      {/* Background Overlay: bg-black/25 for 75% image visibility */}
      <div className="absolute inset-0 bg-black/25 z-0"></div>

      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {error && (
          <div className="bg-red-100/90 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative mb-4 shadow-md backdrop-blur-sm" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {bookingMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out">
            {bookingMessage}
          </div>
        )}
        {bookingError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out">
            <strong className="font-bold">Error!</strong> {bookingError}
          </div>
        )}

        {/* Corrected conditional rendering for message */}
        {message && (
          <p className="text-green-700 text-center text-xl font-medium mb-6 bg-white/70 p-3 rounded-lg shadow-md backdrop-blur-sm">Backend says: {message}</p>
        )}

        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
