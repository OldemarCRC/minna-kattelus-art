import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  useEffect(() => {
  const checkUser = () => {
    const userStr = sessionStorage.getItem('user');
    setUser(userStr ? JSON.parse(userStr) : null);
  };

  checkUser();

  checkUser();

  const handleStorageChange = () => {
    checkUser();
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [location]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          Minna Kattelus
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <Link to="/gallery" className={`nav-link ${isActive('/gallery')}`}>
              {t('nav.gallery')}
            </Link>
          </li>
          <li>
            <Link to="/shop" className={`nav-link ${isActive('/shop')}`}>
              {t('nav.shop')}
            </Link>
          </li>
          <li>
            <Link to="/about-me" className={`nav-link ${isActive('/about-me')}`}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>
              {t('nav.contact')}
            </Link>
          </li>
          {user && (user.role === 'admin' || user.role === 'editor') && (
            <li>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                DASHBOARD
              </Link>
            </li>
          )}
          {user && (
            <li className="user-menu-container">
              <button
                className="user-menu-toggle"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <svg className="user-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="username">{user.username}</span>
                <svg className={`chevron ${showUserMenu ? 'open' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-full-name">{user.fullName}</p>
                    <p className="user-role">{user.role}</p>
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    <svg className="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>

        <div className="navbar-actions">
          <LanguageSwitcher />
          <span className="icon-cart">🛒</span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;