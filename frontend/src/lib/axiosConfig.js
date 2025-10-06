// src/lib/axiosConfig.js
import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5002/api';

// Enable cookies to be sent with cross-origin requests
axios.defaults.withCredentials = true;

// Set timeout to prevent long-hanging requests
axios.defaults.timeout = 5000;

// Add a request interceptor for auth headers
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors more gracefully
    if (!error.response) {
      console.error('Network Error: Backend server may be down or unreachable');
      // Set a custom property to identify connection issues
      error.isConnectionError = true;
      error.friendlyMessage = "Can't connect to server. Please check if backend is running.";
    }
    // Handle authentication errors
    else if (error.response.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;