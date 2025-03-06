import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Read from .env file

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
