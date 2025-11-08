import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import fiTranslation from './locales/fi/translation.json';
import svTranslation from './locales/sv/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  },
  fi: {
    translation: fiTranslation
  },
  sv: {
    translation: svTranslation
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: 'en', // Idioma por defecto si no se detecta ninguno
    lng: 'en', // Idioma inicial (puede ser detectado automáticamente)
    
    interpolation: {
      escapeValue: false // React ya protege contra XSS
    },
    
    detection: {
      // Orden de detección del idioma
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Guardar el idioma seleccionado en localStorage
      caches: ['localStorage']
    }
  });

export default i18n;