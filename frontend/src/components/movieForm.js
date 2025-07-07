// frontend/src/components/MovieForm.js

import React, { useState } from 'react';
import axios from 'axios';

const MovieForm = ({ onMovieAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        releaseDate: '',
        genre: '',
        duration: '',
        posterUrl: '',
        trailerUrl: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { title, description, releaseDate, genre, duration, posterUrl, trailerUrl } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const movieData = {
                title,
                description,
                releaseDate,
                genre: genre.split(',').map(g => g.trim()),
                duration: parseInt(duration),
                posterUrl,
                trailerUrl
            };

            const res = await axios.post('http://localhost:5000/api/movies', movieData);

            setMessage('Movie added successfully!');
            setError('');
            console.log('Movie added:', res.data);

            setFormData({
                title: '',
                description: '',
                releaseDate: '',
                genre: '',
                duration: '',
                posterUrl: '',
                trailerUrl: ''
            });

            if (onMovieAdded) {
                onMovieAdded();
            }

        } catch (err) {
            console.error('Error adding movie:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Failed to add movie. Please check your input.');
            setMessage('');
        }
    };

    return (
        <div className="bg-white/80 p-8 rounded-2xl shadow-2xl mb-8 border border-gray-200 backdrop-blur-md transform transition duration-300 hover:shadow-3xl"> {/* Enhanced container styling */}
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center tracking-wide">Add New Movie</h2>
            <form onSubmit={onSubmit} className="space-y-6"> {/* Increased space-y */}
                {/* Input Fields */}
                {Object.keys(formData).map((key) => {
                    if (key === 'password2') return null;
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    let inputType = 'text';
                    let placeholder = '';
                    if (key === 'email') inputType = 'email';
                    if (key === 'password') inputType = 'password';
                    if (key === 'releaseDate') inputType = 'date';
                    if (key === 'duration') { inputType = 'number'; placeholder = 'e.g., 120'; }
                    if (key === 'posterUrl' || key === 'trailerUrl') { inputType = 'url'; placeholder = 'https://example.com/image.jpg'; }
                    if (key === 'genre') { placeholder = 'e.g., Action, Sci-Fi'; }
                    if (key === 'description') { return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <textarea
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={onChange}
                                required={key !== 'trailerUrl'}
                                rows="3"
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800 placeholder-gray-500"
                            ></textarea>
                        </div>
                    ); }

                    return (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                            <input
                                type={inputType}
                                id={key}
                                name={key}
                                value={formData[key]}
                                onChange={onChange}
                                required={key !== 'trailerUrl'}
                                placeholder={placeholder}
                                min={key === 'duration' ? "1" : undefined}
                                step={key === 'price' ? "0.01" : undefined}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800 placeholder-gray-500"
                            />
                        </div>
                    );
                })}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl"
                >
                    Add Movie
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

export default MovieForm;
