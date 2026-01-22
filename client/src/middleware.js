import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Automatically redirect to locale based on browser settings
  localeDetection: true,

  // Always show the locale prefix in the URL
  localePrefix: 'always'
});

export const config = {
  // Matcher que ignora archivos estáticos y api
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
