'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { stopInactivityDetector } from '@/lib/inactivityDetector';
import axios from '@/lib/axios';
import LanguageSwitcher from './LanguageSwitcher';
import ChangePasswordModal from './ChangePasswordModal';
import CartIcon from './CartIcon';
import '@/styles/Navbar.css';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const currentLang = useLocale();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const isActive = (path) => {
    const fullPath = `/${currentLang}${path}`;
    return pathname === fullPath ? 'active' : '';
  };

  useEffect(() => {
    const checkUser = () => {
      if (typeof window !== 'undefined') {
        const userStr = sessionStorage.getItem('user');
        setUser(userStr ? JSON.parse(userStr) : null);
      }
    };

    checkUser();

    const handleStorageChange = () => {
      checkUser();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [pathname]);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: t('nav.signOut'),
      description: t('nav.signOutConfirm'),
      confirmText: t('nav.signOut'),
      cancelText: t('common.cancel'),
      variant: 'default',
    });

    if (!confirmed) return;

    try {
      stopInactivityDetector();
      await axios.post('/api/auth/logout');

      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      setUser(null);
      setShowUserMenu(false);
      setShowMenu(false);

      toast.success(t('nav.signOutSuccess'));
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      stopInactivityDetector();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  const closeMobileMenu = () => {
    setShowMenu(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link href={`/${currentLang}`} className="navbar-brand" onClick={closeMobileMenu}>
            Minna Kattelus
          </Link>

          {/* Navigation Menu - Hidden on mobile */}
          <ul className={`navbar-menu ${showMenu ? 'open' : ''}`}>
            <li>
              <Link
                href={`/${currentLang}`}
                className={`nav-link ${isActive('/')}`}
                onClick={closeMobileMenu}
              >
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${currentLang}/gallery`}
                className={`nav-link ${isActive('/gallery')}`}
                onClick={closeMobileMenu}
              >
                {t('nav.gallery')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${currentLang}/shop`}
                className={`nav-link ${isActive('/shop')}`}
                onClick={closeMobileMenu}
              >
                {t('nav.shop')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${currentLang}/about-me`}
                className={`nav-link ${isActive('/about-me')}`}
                onClick={closeMobileMenu}
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link
                href={`/${currentLang}/contact`}
                className={`nav-link ${isActive('/contact')}`}
                onClick={closeMobileMenu}
              >
                {t('nav.contact')}
              </Link>
            </li>
            {user && (user.role === 'admin' || user.role === 'editor') && (
              <li>
                <Link
                  href={`/${currentLang}/dashboard`}
                  className={`nav-link ${isActive('/dashboard')}`}
                  onClick={closeMobileMenu}
                >
                  DASHBOARD
                </Link>
              </li>
            )}

          </ul>

          {/* Actions Container (Language and Cart) - Visible on all screens */}
          <div className="navbar-actions">
            {user && (
              <div className="user-menu-container">
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

                    {/* Register User - Admin only */}
                    {user?.role === 'admin' && (
                      <Link
                        href={`/${currentLang}/user-register`}
                        className="dropdown-menu-button"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        {t('admin.registerUser')}
                      </Link>
                    )}

                    <button
                      className="change-password-button"
                      onClick={() => {
                        setShowPasswordModal(true);
                        setShowUserMenu(false);
                      }}
                    >
                      <svg className="password-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      {t('nav.changePassword')}
                    </button>

                    <button className="logout-button" onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(false);
                      handleLogout();
                    }}>
                      <svg className="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('nav.signOut')}
                    </button>
                  </div>
                )}
              </div>
            )}
            <LanguageSwitcher />
            <CartIcon />

            {/* Hamburger Button - Visible only on mobile */}
            <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
              <svg className="hamburguer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showMenu ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </nav>
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        user={user}
      />
      {ConfirmDialog}
    </div>
  );
};

export default Navbar;
