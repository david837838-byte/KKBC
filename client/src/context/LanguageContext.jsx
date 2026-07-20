import React, { createContext, useContext, useState, useEffect } from 'react';
import ar from '../locales/ar';
import en from '../locales/en';

const LanguageContext = createContext();

const dictionaries = { ar, en };

// Common dynamic phrase map for translating DB entries when language === 'en'
const DYNAMIC_PHRASE_MAP = {
  // Sermons & Verses
  'أمانة الله مقابل تمرد الإنسان (مر 1:12-13)': 'God\'s Faithfulness vs. Human Rebellion (Mark 12:1-13)',
  'Announcementات الله مقابل تمرد الإنسان (مر 1:12-13)': 'God\'s Faithfulness vs. Human Rebellion (Mark 12:1-13)',
  'أمانة الله مقابل تمرد الإنسان': 'God\'s Faithfulness vs. Human Rebellion',
  'الرَّبُّ رَاعِيَّ فَلاَ يَعْوِزُنِي شَيْءٌ': 'The LORD is my shepherd; I shall not want.',
  '«الرَّبُّ رَاعِيَّ فَلاَ يَعْوِزُنِي شَيْءٌ»': '«The LORD is my shepherd; I shall not want.»',
  'مزمور 23: 1': 'Psalm 23:1',
  'مزمور 23: 1-6': 'Psalm 23:1-6',
  'روحي': 'Spiritual',
  'دراسي': 'Doctrinal',
  'رعوي': 'Pastoral',

  // News & Announcements titles & full sentences
  'انطلاق المعسكر الصيفي السنوي للأطفال 2026': 'Annual Children\'s Summer Camp Launch 2026',
  'السنويCampانطلاق ال للأطفال 2026': 'Annual Children\'s Summer Camp Launch 2026',
  'الصيفي السنويCampانطلاق ال للأطفال 2026': 'Annual Children\'s Summer Camp Launch 2026',
  'بخصوص بدء سلسلة دراسات جديدة في رسالة رومية': 'Announcement: New Bible Study Series on Romans',
  'Announcement بخصوص بدء سلسلة دراسات جديدة في رسالة رومية': 'Announcement: New Bible Study Series on Romans',
  
  // Specific news content paragraphs
  'عن بدء التسجيل في المعسكر الصيفي السنوي للأطفال تحت عنوان "أبطال الإيمان". يتضمن المعسكر ألعاباً ترفيهية، ترانيم حركية، قصة كتابية وأنشطة متنوعة من عمر 6 إلى 12 سنة. يبدأ في 1 أغسطس ويستمر لمدة أسبوع.': 'Registration is now open for the Annual Children\'s Summer Camp themed "Heroes of Faith". Featuring games, action hymns, Bible lessons, and activities for ages 6-12. Starts August 1st for one week.',
  'نلفت انتباه جميع الإخوة والأخوات إلى أننا سنبدأ الأربعاء القادم سلسلة دراسة جديدة ومفصلة في رسالة الرسول بولس إلى أهل رومية. نشجع الجميع على الحضور والمشاركة الفعالة في هذه الدراسات العميقة.': 'We invite all brothers and sisters to join us next Wednesday for a new in-depth study series on the Epistle of Paul to the Romans. We encourage everyone to attend and participate.',

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
    document.title = isAr ? 'الكنيسة المعمدانية الإنجيلية - خربة قنافار' : 'Evangelical Baptist Church - Khirbet Qanafar';

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

    const trimmed = textAr.trim();

    // Direct match in dynamic dictionary
    if (DYNAMIC_PHRASE_MAP[trimmed]) {
      return DYNAMIC_PHRASE_MAP[trimmed];
    }

    // Substring replacement
    let translated = trimmed;
    let replaced = false;
    for (const [arKey, enValue] of Object.entries(DYNAMIC_PHRASE_MAP)) {
      if (translated.includes(arKey)) {
        translated = translated.replace(new RegExp(arKey, 'g'), enValue);
        replaced = true;
      }
    }

    if (replaced) return translated;

    // Smart sentence keyword fallbacks for news items
    if (trimmed.includes('المعسكر الصيفي') || trimmed.includes('Camp')) {
      if (trimmed.length < 50) return 'Annual Children\'s Summer Camp 2026';
      return 'Registration is now open for the Annual Children\'s Summer Camp themed "Heroes of Faith". Featuring games, action hymns, Bible lessons, and activities for ages 6-12. Starts August 1st for one week.';
    }

    if (trimmed.includes('سلسلة دراسات') || trimmed.includes('رسالة رومية')) {
      if (trimmed.length < 60) return 'Announcement: New Bible Study Series on Romans';
      return 'We invite all brothers and sisters to join us next Wednesday for a new in-depth study series on the Epistle of Paul to the Romans. Everyone is welcome to attend.';
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
