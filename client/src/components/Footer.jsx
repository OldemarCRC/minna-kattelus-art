import { Link } from 'react-router-dom';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <h3>Minna Kattelus</h3>
            <p className="footer-about">
              {t('footer.about')}
            </p>
          </div>

          {/* Links Section */}
          <div className="footer-section">
            <h3>{t('footer.links')}</h3>
            <ul className="footer-links">
              <li><Link to="/galeria">{t('gallery.title')}</Link></li>
              <li><Link to="/tienda">{t('shop.title')}</Link></li>
              <li><Link to="/sobre-mi">{t('about.title')}</Link></li>
              <li><Link to="/contacto">{t('contact.title')}</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3>{t('contact.title')}</h3>
            <ul className="footer-contact">
              <li>
                <a href="mailto:contact@minnakattelus.fi">contact@minnakattelus.fi</a>
              </li>
              <li>{t('contact.info.locationValue')}</li>
            </ul>
          </div>

          {/* Social Section */}
          <div className="footer-section">
            <h3>{t('footer.follow')}</h3>
            <div className="footer-social">
              <a
                href="https://instagram.com/minnak_art"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Instagram
              </a>
            </div>
             <div className="footer-social">
              <a
                href="https://www.linkedin.com/in/minna-kaisu-kattelus-7102b7201/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                Linkedin
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Minna Kattelus. {t('footer.rights')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;