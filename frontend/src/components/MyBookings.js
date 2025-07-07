// frontend/src/components/MyBookings.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyBookings = () => {
    const { user, token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchMyBookings = async () => {
        if (!user || !token) {
            setError('You must be logged in to view your bookings.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const res = await axios.get('http://localhost:5000/api/bookings/mybookings', config);
            setBookings(res.data);
            setLoading(false);
            setError('');
        } catch (err) {
            console.error('Error fetching bookings:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Failed to fetch bookings.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [user, token]);

    const handleCancelBooking = async (bookingId) => {
        setMessage('');
        setError('');
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`, config);
            setMessage('Booking cancelled successfully!');
            fetchMyBookings();
        } catch (err) {
            console.error('Error cancelling booking:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Failed to cancel booking.');
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px] text-white text-2xl"> {/* Text color changed */}
                <p className="text-xl text-gray-200">Loading your bookings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100/90 border border-red-400 text-red-800 px-4 py-3 rounded-lg relative mb-4 shadow-md backdrop-blur-sm" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="bg-white/80 p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto my-10 border border-gray-200 backdrop-blur-md transform transition duration-300 hover:shadow-3xl">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center tracking-wide">My Bookings</h2>

            {message && (
                <div className="mt-4 bg-green-100/90 border border-green-400 text-green-800 px-4 py-3 rounded-lg relative shadow-md backdrop-blur-sm">
                    {message}
                </div>
            )}

            {bookings.length === 0 ? (
                <p className="text-center text-gray-700 text-lg py-10">You have no bookings yet. Go book some movies!</p>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking._id} className="border border-gray-200 rounded-lg p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between bg-gradient-to-br from-gray-50/80 to-gray-100/80 transform transition duration-200 hover:scale-[1.015] backdrop-blur-sm">
                            <div className="mb-4 md:mb-0 md:mr-6 flex-grow">
                                <h3 className="text-xl font-semibold text-purple-700 mb-1">{booking.showtime.movie.title}</h3>
                                <p className="text-gray-700 text-sm mb-0.5">
                                    <span className="font-medium">Showtime:</span> {new Date(booking.showtime.date).toLocaleDateString()} at {booking.showtime.time}
                                </p>
                                <p className="text-gray-700 text-sm mb-0.5">
                                    <span className="font-medium">Theater:</span> {booking.showtime.theater}
                                </p>
                                <p className="text-gray-700 text-sm mb-0.5">
                                    <span className="font-medium">Tickets:</span> {booking.numberOfTickets}
                                </p>
                                <p className="text-gray-700 text-sm mb-0.5">
                                    <span className="font-medium">Total Price:</span> ₹{booking.totalPrice.toFixed(2)}
                                </p>
                                <p className={`text-sm font-semibold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'} mb-1`}>
                                    Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </p>
                                <p className="text-gray-500 text-xs">
                                    Booked On: {new Date(booking.bookedAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 ease-in-out text-base font-semibold self-start md:self-center shadow-md transform hover:scale-105"
                            >
                                Cancel Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
