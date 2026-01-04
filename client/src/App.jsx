import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { startInactivityDetector, stopInactivityDetector } from './utils/inactivityDetector';
import axios from './utils/axios';

import './styles/global.css';

function App() {
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    
    if (user) {
      const handleInactivityLogout = async () => {
        try {
          await axios.post('/api/auth/logout');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          alert('Your session has expired due to inactivity');
          window.location.href = '/';
        } catch (error) {
          console.error('Auto-logout error:', error);
          // Logout local aunque falle el servidor
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('token');
          window.location.href = '/';
        }
      };

      startInactivityDetector(handleInactivityLogout);

      // Cleanup cuando el componente se desmonte
      return () => {
        stopInactivityDetector();
      };
    }
  }, []);

  return (
    <div className="app">
      <Navbar />
      <ScrollRestoration />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
