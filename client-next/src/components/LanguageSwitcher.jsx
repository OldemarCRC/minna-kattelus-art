'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'so', name: 'Af-Soomaali', flag: '🇸🇴' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },

  ];

  const changeLanguage = (newLocale) => {
    // Get current path without locale
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace locale
    const newPath = segments.join('/');

    // Preserve query params
    const searchParams = window.location.search;

    router.push(newPath + searchParams);
  };

  return (
    <div className="language-switcher">
      <select
        value={currentLocale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
