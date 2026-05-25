import { message } from 'antd';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000,
});

// Request interceptor: inject token
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `JWT ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: global error handling
apiClient.interceptors.response.use((res) => res, (error) => {
  const msg = error?.response?.data?.message || error.message || 'Network Error';
  // Lightweight notification for now - projects can replace with their own toast system
  try { message.error(msg); } catch (e) { /* noop */ }
  return Promise.reject(error);
});

export default apiClient;
