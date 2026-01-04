import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable para almacenar el token CSRF
let csrfToken = null;

// Función para obtener token CSRF
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

// Interceptor de request - Agrega CSRF token automáticamente
axiosInstance.interceptors.request.use(
  async (config) => {
    // Solo agregar CSRF en métodos que lo requieren
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

// Interceptor de response - Maneja errores CSRF
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si hay error CSRF (403), renovar token y reintentar
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null; // Limpiar token
      const token = await getCsrfToken(); // Obtener nuevo
      
      if (token) {
        error.config.headers['x-csrf-token'] = token;
        return axiosInstance.request(error.config); // Reintentar
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de sesión
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || '';
      
      // Sesión cerrada por login en otro lugar
      if (message.includes('session has been closed')) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        alert('Your session has been closed because you logged in from another location');
        window.location.href = '/';
      }
      // Token expirado o inválido
      else if (message.includes('expired') || message.includes('Invalid token')) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;