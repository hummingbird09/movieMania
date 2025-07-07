// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this file exists and contains global CSS
import App from './App'; // This imports your main App component

// Create a root for your React application to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
