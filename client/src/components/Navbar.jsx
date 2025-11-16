import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
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