import React, { createContext, useContext, useState, useEffect } from 'react';
import ar from '../locales/ar';
import en from '../locales/en';

const LanguageContext = createContext();

const dictionaries = { ar, en };

// Common dynamic phrase map for translating DB entries when language === 'en'
const DYNAMIC_PHRASE_MAP = {
  // Days
  'الأحد': 'Sunday',
  'الإثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الخميس': 'Thursday',
  'الجمعة': 'Friday',
  'السبت': 'Saturday',
  'كل يوم أحد': 'Every Sunday',
  'كل يوم جمعة': 'Every Friday',
  'كل يوم أربعاء': 'Every Wednesday',

  // Meetings & Services
  'اجتماع العبادة الرئيسي': 'Main Sunday Worship Service',
  'اجتماع العبادة': 'Worship Service',
  'اجتماع الصلاة': 'Prayer Meeting',
  'اجتماع الصلاة ودراسة الكتاب': 'Prayer & Bible Study Meeting',
  'اجتماع الشباب': 'Youth Fellowship Meeting',
  'اجتماع الشباب والفرسان': 'Youth & Young Adults Fellowship',
  'اجتماع السيدات': 'Ladies Fellowship Meeting',
  'مدارس الأحد للأطفال': 'Children\'s Sunday School',
  'مدرسة الأحد': 'Sunday School',
  'دراسة كتابية': 'Bible Study',

  // Locations & Preachers
  'مبنى الكنيسة': 'Church Building',
  'قاعة الكنيسة الرئيسية': 'Main Church Hall',
  'قاعة الاجتماعات': 'Meeting Hall',
  'القس الراعي': 'The Pastor',
  'الواعظ': 'Preacher',

  // Categories & Tags
  'إعلان': 'Announcement',
  'إعلان هام': 'Important Announcement',
  'إعلانات عامة': 'General Announcements',
  'فعالية': 'Event',
  'فعالية كنسية': 'Church Event',
  'فعاليات ومخيمات': 'Events & Camps',
  'خبر': 'News',
  'أخبار الكنيسة': 'Church News',
  'مخيم صيفي': 'Summer Camp',
  'مخيم': 'Camp',
  'دراسات كتابية': 'Biblical Studies',
  'تأملات روحية': 'Spiritual Meditations',
  'الأسرة المسيحية': 'Christian Family',
  'مقالات روحية': 'Spiritual Articles',
};

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

  // Dictionary lookup function
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
            return path;
          }
        }
        return fallback;
      }
    }

    return current;
  };

  // Dynamic Content Translator (translates dynamic text from DB entries when language === 'en')
  const translateText = (textAr, textEn) => {
    if (!textAr) return '';
    if (language === 'ar') return textAr;

    // If explicit English translation provided in DB item, return it
    if (textEn && textEn.trim() !== '') return textEn;

    // Direct match in dynamic dictionary
    if (DYNAMIC_PHRASE_MAP[textAr.trim()]) {
      return DYNAMIC_PHRASE_MAP[textAr.trim()];
    }

    // Replace substring occurrences of known terms
    let translated = textAr;
    let matched = false;
    for (const [arKey, enValue] of Object.entries(DYNAMIC_PHRASE_MAP)) {
      if (translated.includes(arKey)) {
        translated = translated.replace(new RegExp(arKey, 'g'), enValue);
        matched = true;
      }
    }

    return translated;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage, t, translateText }}>
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
