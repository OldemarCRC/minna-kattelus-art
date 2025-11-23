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
import UserRegister from './pages/UserRegister';

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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'user-register', element: <UserRegister />},
      { path: '*', element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
