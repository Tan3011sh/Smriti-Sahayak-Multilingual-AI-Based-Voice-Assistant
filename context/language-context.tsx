'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage, LanguageMeta, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from '@/types/language';
import { getTranslation } from '@/data/locales';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  meta: LanguageMeta;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const defaultContextValue: LanguageContextType = {
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  meta: SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE],
  t: (key: string, params?: Record<string, string | number>) => getTranslation(key, DEFAULT_LANGUAGE, params),
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'as')) {
        setLanguageState(savedLang);
      }
    } catch (e) {
      console.warn('Could not read saved language from localStorage:', e);
    }
  }, []);

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Could not persist language to localStorage:', e);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(key, language, params);
  };

  const meta = SUPPORTED_LANGUAGES[language] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, meta, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
