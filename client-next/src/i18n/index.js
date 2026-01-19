/**
 * TODO: FUTURE i18n IMPROVEMENTS
 * 
 * 1. Make default locale configurable via env variable
 *    - Add NEXT_PUBLIC_DEFAULT_LOCALE to .env
 *    - Remove hardcoded 'en' references
 * 
 * 2. Implement slug translation (localized routes)
 *    - /gallery (en) → /es/galeria → /fi/galleria
 *    - See docs/SCALING.md for implementation guide
 * 
 * 3. Remove prefix from default locale
 *    - /en/gallery → /gallery
 *    - Requires middleware update
 */

export const locales = ['en', 'es', 'fi', 'sv', 'so'];
export const defaultLocale = 'en';

export const localeNames = {
  en: 'English',
  es: 'Español',
  fi: 'Suomi',
  sv: 'Svenska',
  so: 'Af-Soomaali',
};

export const localeFlags = {
  en: '🇬🇧',
  es: '🇪🇸',
  fi: '🇫🇮',
  sv: '🇸🇪',
  so: '🇸🇴'
};