// frontend/src/components/ShowtimeCard.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ShowtimeCard = ({ showtime, onBookTickets }) => {
    const { user } = useContext(AuthContext);
    const [ticketsToBook, setTicketsToBook] = useState(1);

    const handleTicketsChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= showtime.availableSeats) {
            setTicketsToBook(value);
        } else if (value < 1) {
            setTicketsToBook(1);
        } else if (value > showtime.availableSeats) {
            setTicketsToBook(showtime.availableSeats);
        }
    };

    const handleBookClick = () => {
        onBookTickets(showtime._id, ticketsToBook);
    };

    return (
        <div className="bg-white/80 p-4 rounded-lg shadow-lg border border-gray-200 transform transition duration-200 hover:scale-[1.03] backdrop-blur-sm"> {/* Enhanced card styling */}
            <p className="text-base font-semibold text-gray-900 mb-1">
                <span className="text-blue-700">Date: {new Date(showtime.date).toLocaleDateString()}</span>
            </p>
            <p className="text-base font-semibold text-gray-900 mb-1">
                <span className="text-purple-700">Time: {showtime.time}</span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
                Theater: <span className="font-medium">{showtime.theater}</span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
                Price: <span className="font-medium">₹{showtime.price.toFixed(2)}</span>
            </p>
            <p className="text-sm text-gray-700 mb-2">
                Seats Available: <span className="font-bold text-green-600">{showtime.availableSeats}</span> / {showtime.totalSeats}
            </p>

            {user ? (
                <div className="mt-3 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                        type="number"
                        min="1"
                        max={showtime.availableSeats}
                        value={ticketsToBook}
                        onChange={handleTicketsChange}
                        className="w-full sm:w-24 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                        disabled={showtime.availableSeats === 0}
                    />
                    <button
                        onClick={handleBookClick}
                        className="w-full sm:flex-1 bg-blue-600 text-white py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        disabled={showtime.availableSeats === 0 || ticketsToBook > showtime.availableSeats || ticketsToBook < 1}
                    >
                        {showtime.availableSeats > 0 ? 'Book Tickets' : 'Sold Out'}
                    </button>
                </div>
            ) : (
                <p className="mt-2 text-sm text-gray-600 text-center">Login to book tickets.</p>
            )}
        </div>
    );
};

export default ShowtimeCard;