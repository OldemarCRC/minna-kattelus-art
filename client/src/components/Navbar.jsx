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
            <Link to="/galeria" className={`nav-link ${isActive('/galeria')}`}>
              {t('nav.gallery')}
            </Link>
          </li>
          <li>
            <Link to="/tienda" className={`nav-link ${isActive('/tienda')}`}>
              {t('nav.shop')}
            </Link>
          </li>
          <li>
            <Link to="/sobre-mi" className={`nav-link ${isActive('/sobre-mi')}`}>
              {t('nav.about')}
            </Link>
          </li>
          <li>
            <Link to="/contacto" className={`nav-link ${isActive('/contacto')}`}>
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