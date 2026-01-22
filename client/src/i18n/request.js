import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './index';

export default getRequestConfig(async ({ requestLocale }) => {
  // Primero esperamos la promesa
  let locale = await requestLocale;

  // Si por alguna razón sigue siendo undefined, usamos el default
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
