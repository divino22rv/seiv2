import axios from 'axios';

// Change this base URL to match your API server
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      errors: error.response?.data?.errors,
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export default api;