import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'galeria', element: <Gallery /> },
      { path: 'tienda', element: <Shop /> },
      { path: 'sobre-mi', element: <About /> },
      { path: 'contacto', element: <Contact /> },
      { path: 'olivia', element: <Login /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
