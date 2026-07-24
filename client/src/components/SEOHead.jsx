import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PAGE_TITLES = {
  '/': { ar: 'الكنيسة المعمدانية الإنجيلية في خربة قنافار', en: 'Khirbet Qanafar Baptist Church' },
  '/about': { ar: 'من نحن - كنيسة خربة قنافار', en: 'About Us - Khirbet Qanafar Church' },
  '/meetings': { ar: 'مواعيد الاجتماعات والخدمات - كنيسة خربة قنافار', en: 'Meetings & Services - Khirbet Qanafar Church' },
  '/sermons': { ar: 'مكتبة العظات والرسائل الإنجيلية - كنيسة خربة قنافار', en: 'Sermons Library - Khirbet Qanafar Church' },
  '/live': { ar: 'البث المباشر للخدمات الكنسية - كنيسة خربة قنافار', en: 'Live Stream - Khirbet Qanafar Church' },
  '/hymns': { ar: 'مكتبة الترانيم المسيحية - كنيسة خربة قنافار', en: 'Hymns & Worship - Khirbet Qanafar Church' },
  '/bible': { ar: 'الكتاب المقدس - كنيسة خربة قنافار', en: 'Holy Bible - Khirbet Qanafar Church' },
  '/news': { ar: 'الأخبار والإعلانات الكنسية - كنيسة خربة قنافار', en: 'News & Announcements - Khirbet Qanafar Church' },
  '/articles': { ar: 'الدراسات والمقالات الروحية - كنيسة خربة قنافار', en: 'Spiritual Articles - Khirbet Qanafar Church' },
  '/prayer': { ar: 'طلبات الصلاة - كنيسة خربة قنافار', en: 'Prayer Requests - Khirbet Qanafar Church' },
  '/counseling': { ar: 'طلبات الإرشاد والمشورة - كنيسة خربة قنافار', en: 'Counseling Requests - Khirbet Qanafar Church' },
  '/gallery': { ar: 'معرض الصور والنشاطات - كنيسة خربة قنافار', en: 'Photo Gallery - Khirbet Qanafar Church' },
  '/contact': { ar: 'تواصل معنا والموقع الجغرافي - كنيسة خربة قنافار', en: 'Contact Us - Khirbet Qanafar Church' },
  '/app': { ar: 'تنزيل تطبيق الكنيسة - كنيسة خربة قنافار', en: 'Download Church App - Khirbet Qanafar Church' },
};

const SEOHead = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const path = location.pathname;
    const pageInfo = PAGE_TITLES[path];
    const defaultTitle = language === 'ar' 
      ? 'الكنيسة المعمدانية الإنجيلية في خربة قنافار' 
      : 'Khirbet Qanafar Baptist Church';

    if (pageInfo) {
      document.title = `${pageInfo[language] || pageInfo.ar} | kherbetbaptistchurch.org`;
    } else {
      document.title = `${defaultTitle} | kherbetbaptistchurch.org`;
    }

    // Scroll to top on route change for smooth user experience
    window.scrollTo(0, 0);
  }, [location.pathname, language]);

  return null;
};

export default SEOHead;
