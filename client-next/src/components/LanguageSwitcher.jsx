'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
  ];

  const changeLanguage = (newLocale) => {
    // Get current path without locale
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace locale
    const newPath = segments.join('/');
    
    router.push(newPath);
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
