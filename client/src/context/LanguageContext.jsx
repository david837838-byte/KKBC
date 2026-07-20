import React, { createContext, useContext, useState, useEffect } from 'react';
import ar from '../locales/ar';
import en from '../locales/en';

const LanguageContext = createContext();

const dictionaries = { ar, en };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('church_lang') || 'ar';
  });

  const changeLanguage = (lang) => {
    if (lang !== 'ar' && lang !== 'en') return;
    setLanguageState(lang);
    localStorage.setItem('church_lang', lang);
  };

  const toggleLanguage = () => {
    changeLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const isAr = language === 'ar';
    document.documentElement.lang = language;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    if (isAr) {
      document.body.classList.remove('lang-en');
      document.body.classList.add('lang-ar');
    } else {
      document.body.classList.remove('lang-ar');
      document.body.classList.add('lang-en');
    }
  }, [language]);

  // Translation helper function t('nav.home')
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let current = dictionaries[language] || dictionaries.ar;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Arabic dictionary if key missing in English
        let fallback = dictionaries.ar;
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return path; // Return key path if missing everywhere
          }
        }
        return fallback;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
