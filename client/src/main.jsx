import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext'; // ← AGREGAR
import App from './App.jsx';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserRegister from './pages/UserRegister';
import ProtectedRoute from './components/ProtectedRoute';
import VerifyEmail from './pages/VerifyEmail.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'shop', element: <Shop /> },
      { path: 'about-me', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'olivia', element: <Login /> },
      { path: 'teresa', element: <Login /> },
      { path: 'verify-email/:token', element: <VerifyEmail /> },
      {
        path: 'dashboard', element: (
          <ProtectedRoute allowedRoles={['admin', 'editor']}>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      {
        path: 'user-register', element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <UserRegister />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>  {/* ← AGREGAR ESTA LÍNEA */}
      <RouterProvider router={router} />
    </AuthContextProvider>  {/* ← AGREGAR ESTA LÍNEA */}
  </React.StrictMode>,
);
