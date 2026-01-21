import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable to store CSRF token
let csrfToken = null;

// Function to get CSRF token
const getCsrfToken = async () => {
  if (!csrfToken) {
    try {
      const response = await axios.get(`${API_URL}/api/csrf-token`, {
        withCredentials: true
      });
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error('Error getting CSRF token:', error);
    }
  }
  return csrfToken;
};

// Request interceptor - Add CSRF token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for mutation methods
    if (['post', 'put', 'delete', 'patch'].includes(config.method.toLowerCase())) {
      const token = await getCsrfToken();
      if (token) {
        config.headers['x-csrf-token'] = token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle CSRF errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If CSRF error (403), renew token and retry
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null; // Clear token
      const token = await getCsrfToken(); // Get new token
      if (token) {
        error.config.headers['x-csrf-token'] = token;
        return axiosInstance.request(error.config); // Retry request
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor for session errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      
      // Session closed due to login from another location
      if (message.includes('session has been closed')) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          
          // Use toast instead of alert
          toast.warning('Session Closed', {
            description: 'Your session has been closed because you logged in from another location.',
            duration: 5000,
          });
          
          // Delay redirect to let user see the toast
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      }
      // Expired or invalid token
      else if (message.includes('expired') || message.includes('Invalid token')) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
