// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap your application and provide auth state
export const AuthProvider = ({ children }) => {
    // State to hold user information and token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded

    // Load user and token from localStorage on initial render
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // Optionally, you can verify the token with your backend here if needed
                // For now, we trust localStorage, but in a real app, you'd validate
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                logout(); // Clear invalid data
            }
        }
        setLoading(false); // Finished loading auth state
    }, []);

    // Login function: sets user and token, stores in localStorage
    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
    };

    // Logout function: clears user and token, removes from localStorage
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // Provide the auth state and functions to children components
    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
