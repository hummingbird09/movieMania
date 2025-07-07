// frontend/src/components/Navbar.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gradient-to-r from-blue-800 to-purple-900 p-4 shadow-2xl relative z-20"> {/* Stronger gradient, higher z-index */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                {/* Brand/Logo */}
                <h1
                    className="text-white text-4xl font-extrabold cursor-pointer mb-4 md:mb-0 tracking-wider hover:text-yellow-300 transition duration-300 ease-in-out transform hover:scale-105" // Larger, more tracking, hover effect
                    onClick={() => setCurrentPage('movies')}
                >
                    MovieMania
                </h1>

                {/* Navigation Links */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center">
                    {user ? (
                        <>
                            {/* Movies Link */}
                            <button
                                onClick={() => setCurrentPage('movies')}
                                className={`text-white text-lg font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 ${
                                    currentPage === 'movies' ? 'bg-blue-700 shadow-lg' : 'bg-blue-600'
                                }`}
                            >
                                Movies
                            </button>
                            {/* My Bookings Link */}
                            <button
                                onClick={() => setCurrentPage('mybookings')}
                                className={`text-white text-lg font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 ${
                                    currentPage === 'mybookings' ? 'bg-blue-700 shadow-lg' : 'bg-blue-600'
                                }`}
                            >
                                My Bookings
                            </button>
                            {/* Welcome Message and Logout Button */}
                            <span className="text-white text-lg font-medium mr-2 hidden md:inline text-opacity-80">
                                Welcome, {user.username}!
                            </span>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white text-lg font-semibold py-2 px-5 rounded-full hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Login/Register Buttons */}
                            <button
                                onClick={() => setCurrentPage('login')}
                                className={`text-white text-lg font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 ${
                                    currentPage === 'login' ? 'bg-blue-700 shadow-lg' : 'bg-blue-600'
                                }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setCurrentPage('register')}
                                className={`text-white text-lg font-semibold py-2 px-5 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-700 ${
                                    currentPage === 'register' ? 'bg-blue-700 shadow-lg' : 'bg-blue-600'
                                }`}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
