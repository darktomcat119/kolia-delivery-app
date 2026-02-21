import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import pt from './locales/pt.json';
import en from './locales/en.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'pt';
const supportedLanguage = deviceLanguage === 'en' ? 'en' : 'pt';

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  lng: supportedLanguage,
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
