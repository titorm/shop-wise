
"use client";

import i18n from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'pt-BR',
    fallbackLng: "pt-BR",
    supportedLngs: ['en', 'pt-BR'],
    debug: false,
    interpolation: {
      escapeValue: false, 
    },
    ns: ['common'],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
        useSuspense: false,
    }
  });

export default i18n;

export function useTranslation(ns = 'common') {
    return useTranslationOrg(ns);
}
