// frontend/src/components/ShowtimeForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowtimeForm = ({ onShowtimeAdded }) => {
    const [movies, setMovies] = useState([]);
    const [formData, setFormData] = useState({
        movie: '',
        date: '',
        time: '',
        theater: '',
        totalSeats: '',
        price: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/movies');
                setMovies(res.data);
            } catch (err) {
                console.error('Error fetching movies for showtime form:', err);
                setError('Failed to load movies. Please ensure backend is running and movies exist.');
            }
        };
        fetchMovies();
    }, []);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const showtimeData = {
                movie: formData.movie,
                date: new Date(formData.date).toISOString(),
                time: formData.time,
                theater: formData.theater,
                totalSeats: parseInt(formData.totalSeats),
                price: parseFloat(formData.price)
            };

            if (!showtimeData.movie || !showtimeData.date || !showtimeData.time || !showtimeData.theater || isNaN(showtimeData.totalSeats) || isNaN(showtimeData.price)) {
                setError('Please fill in all required fields correctly.');
                return;
            }
            if (showtimeData.totalSeats <= 0) {
                setError('Total seats must be a positive number.');
                return;
            }
            if (showtimeData.price < 0) {
                setError('Price cannot be negative.');
                return;
            }

            const res = await axios.post('http://localhost:5000/api/showtimes', showtimeData);

            setMessage('Showtime added successfully!');
            setError('');
            console.log('Showtime added:', res.data);

            setFormData({
                movie: '',
                date: '',
                time: '',
                theater: '',
                totalSeats: '',
                price: ''
            });

            if (onShowtimeAdded) {
                onShowtimeAdded();
            }

        } catch (err) {
            console.error('Error adding showtime:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Failed to add showtime. Please check your input.');
        }
    };

    return (
        <div className="bg-white/80 p-8 rounded-2xl shadow-2xl mb-8 border border-gray-200 backdrop-blur-md transform transition duration-300 hover:shadow-3xl">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center tracking-wide">Add New Showtime</h2>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Movie Select */}
                <div>
                    <label htmlFor="movie" className="block text-sm font-semibold text-gray-700 mb-1">Movie</label>
                    <select
                        id="movie"
                        name="movie"
                        value={formData.movie}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    >
                        <option value="">Select a movie</option>
                        {movies.map(movie => (
                            <option key={movie._id} value={movie._id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Date */}
                <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Time */}
                <div>
                    <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Theater */}
                <div>
                    <label htmlFor="theater" className="block text-sm font-semibold text-gray-700 mb-1">Theater</label>
                    <input
                        type="text"
                        id="theater"
                        name="theater"
                        value={formData.theater}
                        onChange={onChange}
                        required
                        placeholder="e.g., Screen 1, VIP Hall"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Total Seats */}
                <div>
                    <label htmlFor="totalSeats" className="block text-sm font-semibold text-gray-700 mb-1">Total Seats</label>
                    <input
                        type="number"
                        id="totalSeats"
                        name="totalSeats"
                        value={formData.totalSeats}
                        onChange={onChange}
                        required
                        min="1"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={onChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl"
                >
                    Add Showtime
                </button>
            </form>

            {/* Messages and Errors */}
            {message && (
                <div className="mt-6 bg-green-100/90 border border-green-400 text-green-800 px-4 py-3 rounded-lg relative shadow-md backdrop-blur-sm">
                    {message}
                </div>
            )}
            {error && (
                <div className="mt-6 bg-red-100/90 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative shadow-md backdrop-blur-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ShowtimeForm;