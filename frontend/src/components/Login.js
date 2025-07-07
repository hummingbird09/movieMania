// frontend/src/components/Login.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Login = ({ onSwitchToRegister }) => {
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            login(res.data, res.data.token);
            setMessage('Login successful! You are now logged in.');
            setError('');
            console.log('User logged in:', res.data);

        } catch (err) {
            console.error('Login error:', err.response ? err.response.data : err.message);
            setError(err.response && err.response.data && err.response.data.msg
                ? err.response.data.msg
                : 'Login failed. Invalid credentials.');
            setMessage('');
        }
    };

    return (
        <div className="bg-white/80 p-8 rounded-2xl shadow-2xl max-w-md mx-auto my-10 border border-gray-200 backdrop-blur-md transform transition duration-300 hover:shadow-3xl">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-wide">Login</h2>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Password Input */}
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 ease-in-out bg-white/70 text-gray-800"
                    />
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out transform hover:scale-105 hover:shadow-xl"
                >
                    Login
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

            {/* Switch to Register */}
            <p className="mt-6 text-center text-gray-700">
                Don't have an account?{' '}
                <button
                    onClick={onSwitchToRegister}
                    className="text-blue-600 hover:text-blue-800 font-semibold focus:outline-none transition duration-150 ease-in-out transform hover:scale-105"
                >
                    Register
                </button>
            </p>
        </div>
    );
};

export default Login;