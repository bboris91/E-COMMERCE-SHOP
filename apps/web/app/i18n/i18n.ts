import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import sr from './sr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sr: { translation: sr },
    },
    fallbackLng: 'sr',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
