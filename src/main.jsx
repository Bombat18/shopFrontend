import React from 'react';
import ReactDOM from 'react-dom/client';  // Use the correct React DOM import for React 18 and later
import './index.css';
import App from './App';

// Create the root of the app using the new React 18 API
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
