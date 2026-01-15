'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import '@/styles/Footer.css';

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  const [decodedEmail, setDecodedEmail] = useState('Loading...');

  useEffect(() => {
    // Email ofuscado en Base64
    const encoded = 'bWlubmFrYXR0ZWx1c0BnbWFpbC5jb20='; 
    try {

      setDecodedEmail(window.atob(encoded));
    } catch (e) {
      console.error("Error decoding email", e);
    }
  }, []);

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
              <li><Link href={`/${locale}/gallery`}>{t('gallery.title')}</Link></li>
              <li><Link href={`/${locale}/shop`}>{t('shop.title')}</Link></li>
              <li><Link href={`/${locale}/about-me`}>{t('about.title')}</Link></li>
              <li><Link href={`/${locale}/contact`}>{t('contact.title')}</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer-section">
            <h3>{t('contact.title')}</h3>
            <ul className="footer-contact">
              <li>
                <Link href={`/${locale}/contact`} id="footer-email-link">
                  {decodedEmail}
                </Link>
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
          <p>&copy; {currentYear} Minna Kattelus. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;