import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import pt from './locales/pt.json';
import en from './locales/en.json';
import fr from './locales/fr.json';

const SUPPORTED_LANGUAGES = ['fr', 'en', 'pt'] as const;
const deviceLanguage = getLocales()[0]?.languageCode ?? 'fr';
const supportedLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLanguage)
  ? deviceLanguage
  : 'fr';

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: supportedLanguage,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
