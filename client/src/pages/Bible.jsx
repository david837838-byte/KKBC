import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, Copy, Check, Search, BookMarked, RefreshCw, ChevronRight, ChevronLeft, Star, Share2, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ===== TRANSLATIONS (hardcoded for fast load) =====
const TRANSLATIONS = [
  { id: 'arb_vdv', name: 'العربية - ترجمة فان دايك',             lang: 'ar', dir: 'rtl' },
  { id: 'ARBNAV',  name: 'العربية - ترجمة الحياة الجديدة (NAV)', lang: 'ar', dir: 'rtl' },
  { id: 'BSB',     name: 'English - Berean Standard Bible',       lang: 'en', dir: 'ltr' },
  { id: 'eng_kjv', name: 'English - King James Version (KJV)',    lang: 'en', dir: 'ltr' },
  { id: 'ENGWEBP', name: 'English - World English Bible (WEB)',   lang: 'en', dir: 'ltr' },
  { id: 'AAB',     name: 'English - Accessible Ancients Bible',   lang: 'en', dir: 'ltr' },
];

// ===== BIBLE BOOKS (full 66 books) =====
const BIBLE_BOOKS = [
  { id: 'GEN', name: 'التكوين', nameEn: 'Genesis', testament: 'old', chapters: 50 },
  { id: 'EXO', name: 'الخروج', nameEn: 'Exodus', testament: 'old', chapters: 40 },
  { id: 'LEV', name: 'اللاويين', nameEn: 'Leviticus', testament: 'old', chapters: 27 },
  { id: 'NUM', name: 'العدد', nameEn: 'Numbers', testament: 'old', chapters: 36 },
  { id: 'DEU', name: 'التثنية', nameEn: 'Deuteronomy', testament: 'old', chapters: 34 },
  { id: 'JOS', name: 'يشوع', nameEn: 'Joshua', testament: 'old', chapters: 24 },
  { id: 'JDG', name: 'القضاة', nameEn: 'Judges', testament: 'old', chapters: 21 },
  { id: 'RUT', name: 'راعوث', nameEn: 'Ruth', testament: 'old', chapters: 4 },
  { id: '1SA', name: 'صموئيل الأول', nameEn: '1 Samuel', testament: 'old', chapters: 31 },
  { id: '2SA', name: 'صموئيل الثاني', nameEn: '2 Samuel', testament: 'old', chapters: 24 },
  { id: '1KI', name: 'الملوك الأول', nameEn: '1 Kings', testament: 'old', chapters: 22 },
  { id: '2KI', name: 'الملوك الثاني', nameEn: '2 Kings', testament: 'old', chapters: 25 },
  { id: '1CH', name: 'أيام الأول', nameEn: '1 Chronicles', testament: 'old', chapters: 29 },
  { id: '2CH', name: 'أيام الثاني', nameEn: '2 Chronicles', testament: 'old', chapters: 36 },
  { id: 'EZR', name: 'عزرا', nameEn: 'Ezra', testament: 'old', chapters: 10 },
  { id: 'NEH', name: 'نحميا', nameEn: 'Nehemiah', testament: 'old', chapters: 13 },
  { id: 'EST', name: 'أستير', nameEn: 'Esther', testament: 'old', chapters: 10 },
  { id: 'JOB', name: 'أيوب', nameEn: 'Job', testament: 'old', chapters: 42 },
  { id: 'PSA', name: 'المزامير', nameEn: 'Psalms', testament: 'old', chapters: 150 },
  { id: 'PRO', name: 'الأمثال', nameEn: 'Proverbs', testament: 'old', chapters: 31 },
  { id: 'ECC', name: 'الجامعة', nameEn: 'Ecclesiastes', testament: 'old', chapters: 12 },
  { id: 'SNG', name: 'نشيد الأناشيد', nameEn: 'Song of Solomon', testament: 'old', chapters: 8 },
  { id: 'ISA', name: 'إشعياء', nameEn: 'Isaiah', testament: 'old', chapters: 66 },
  { id: 'JER', name: 'إرميا', nameEn: 'Jeremiah', testament: 'old', chapters: 52 },
  { id: 'LAM', name: 'مراثي إرميا', nameEn: 'Lamentations', testament: 'old', chapters: 5 },
  { id: 'EZK', name: 'حزقيال', nameEn: 'Ezekiel', testament: 'old', chapters: 48 },
  { id: 'DAN', name: 'دانيال', nameEn: 'Daniel', testament: 'old', chapters: 12 },
  { id: 'HOS', name: 'هوشع', nameEn: 'Hosea', testament: 'old', chapters: 14 },
  { id: 'JOL', name: 'يوئيل', nameEn: 'Joel', testament: 'old', chapters: 3 },
  { id: 'AMO', name: 'عاموس', nameEn: 'Amos', testament: 'old', chapters: 9 },
  { id: 'OBA', name: 'عوبديا', nameEn: 'Obadiah', testament: 'old', chapters: 1 },
  { id: 'JON', name: 'يونان', nameEn: 'Jonah', testament: 'old', chapters: 4 },
  { id: 'MIC', name: 'ميخا', nameEn: 'Micah', testament: 'old', chapters: 7 },
  { id: 'NAM', name: 'ناحوم', nameEn: 'Nahum', testament: 'old', chapters: 3 },
  { id: 'HAB', name: 'حبقوق', nameEn: 'Habakkuk', testament: 'old', chapters: 3 },
  { id: 'ZEP', name: 'صفنيا', nameEn: 'Zephaniah', testament: 'old', chapters: 3 },
  { id: 'HAG', name: 'حجي', nameEn: 'Haggai', testament: 'old', chapters: 2 },
  { id: 'ZEC', name: 'زكريا', nameEn: 'Zechariah', testament: 'old', chapters: 14 },
  { id: 'MAL', name: 'ملاخي', nameEn: 'Malachi', testament: 'old', chapters: 4 },
  { id: 'MAT', name: 'متى', nameEn: 'Matthew', testament: 'new', chapters: 28 },
  { id: 'MRK', name: 'مرقس', nameEn: 'Mark', testament: 'new', chapters: 16 },
  { id: 'LUK', name: 'لوقا', nameEn: 'Luke', testament: 'new', chapters: 24 },
  { id: 'JHN', name: 'يوحنا', nameEn: 'John', testament: 'new', chapters: 21 },
  { id: 'ACT', name: 'أعمال الرسل', nameEn: 'Acts', testament: 'new', chapters: 28 },
  { id: 'ROM', name: 'رومية', nameEn: 'Romans', testament: 'new', chapters: 16 },
  { id: '1CO', name: 'كورنثوس الأول', nameEn: '1 Corinthians', testament: 'new', chapters: 16 },
  { id: '2CO', name: 'كورنثوس الثاني', nameEn: '2 Corinthians', testament: 'new', chapters: 13 },
  { id: 'GAL', name: 'غلاطية', nameEn: 'Galatians', testament: 'new', chapters: 6 },
  { id: 'EPH', name: 'أفسس', nameEn: 'Ephesians', testament: 'new', chapters: 6 },
  { id: 'PHP', name: 'فيلبي', nameEn: 'Philippians', testament: 'new', chapters: 4 },
  { id: 'COL', name: 'كولوسي', nameEn: 'Colossians', testament: 'new', chapters: 4 },
  { id: '1TH', name: 'تسالونيكي الأول', nameEn: '1 Thessalonians', testament: 'new', chapters: 5 },
  { id: '2TH', name: 'تسالونيكي الثاني', nameEn: '2 Thessalonians', testament: 'new', chapters: 3 },
  { id: '1TI', name: 'تيموثاوس الأول', nameEn: '1 Timothy', testament: 'new', chapters: 6 },
  { id: '2TI', name: 'تيموثاوس الثاني', nameEn: '2 Timothy', testament: 'new', chapters: 4 },
  { id: 'TIT', name: 'تيطس', nameEn: 'Titus', testament: 'new', chapters: 3 },
  { id: 'PHM', name: 'فيلمون', nameEn: 'Philemon', testament: 'new', chapters: 1 },
  { id: 'HEB', name: 'العبرانيين', nameEn: 'Hebrews', testament: 'new', chapters: 13 },
  { id: 'JAS', name: 'يعقوب', nameEn: 'James', testament: 'new', chapters: 5 },
  { id: '1PE', name: 'بطرس الأول', nameEn: '1 Peter', testament: 'new', chapters: 5 },
  { id: '2PE', name: 'بطرس الثاني', nameEn: '2 Peter', testament: 'new', chapters: 3 },
  { id: '1JN', name: 'يوحنا الأول', nameEn: '1 John', testament: 'new', chapters: 5 },
  { id: '2JN', name: 'يوحنا الثاني', nameEn: '2 John', testament: 'new', chapters: 1 },
  { id: '3JN', name: 'يوحنا الثالث', nameEn: '3 John', testament: 'new', chapters: 1 },
  { id: 'JUD', name: 'يهوذا', nameEn: 'Jude', testament: 'new', chapters: 1 },
  { id: 'REV', name: 'الرؤيا', nameEn: 'Revelation', testament: 'new', chapters: 22 },
];

// Extract plain text from verse content array (handles strings + objects)
function extractVerseText(content) {
  if (!Array.isArray(content)) return String(content || '');
  return content.map(item => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && item.text) return item.text;
    return '';
  }).join(' ').trim();
}

const Bible = () => {
  const { t, language } = useLanguage();
  const [selectedTranslation, setSelectedTranslation] = useState(TRANSLATIONS[0]);
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[0]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedVerse, setCopiedVerse] = useState(null);
  const [activeTestament, setActiveTestament] = useState('old');
  const [showBookList, setShowBookList] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('bible_favorites') || '[]'));
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const versesRef = useRef(null);

  const chapterOptions = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);

  // Fetch chapter via our server proxy
  const fetchChapter = async () => {
    setLoading(true);
    setError('');
    setVerses([]);
    try {
      const url = `/api/bible/chapter?translation=${selectedTranslation.id}&book=${selectedBook.id}&chapter=${selectedChapter}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'فشل في تحميل الإصحاح.');

      const chapterData = json.data?.chapter;
      if (!chapterData || !chapterData.content) throw new Error('لا توجد بيانات لهذا الإصحاح.');

      // Extract only verse items (filter out headings, line_breaks)
      const verseItems = chapterData.content.filter(item => item.type === 'verse');
      setVerses(verseItems);

      setTimeout(() => {
        if (versesRef.current) versesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل الآيات. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
  }, [selectedTranslation, selectedBook, selectedChapter]);

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setShowBookList(false);
  };

  const prevChapter = () => { if (selectedChapter > 1) setSelectedChapter(p => p - 1); };
  const nextChapter = () => { if (selectedChapter < selectedBook.chapters) setSelectedChapter(p => p + 1); };

  const copyVerse = (verseText, verseNum) => {
    const text = `${verseText} — ${selectedBook.name} ${selectedChapter}:${verseNum}`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const toggleFavorite = (bookId, bookName, chapter, verseNum, verseText) => {
    const key = `${bookId}_${chapter}_${verseNum}`;
    let newFavs = [...favorites];
    const index = newFavs.findIndex(f => f.key === key);
    
    if (index > -1) {
      newFavs.splice(index, 1);
    } else {
      newFavs.push({ key, bookId, bookName, chapter, verseNum, text: verseText, createdAt: Date.now() });
    }
    
    setFavorites(newFavs);
    localStorage.setItem('bible_favorites', JSON.stringify(newFavs));
  };

  const shareVerse = (verseText, bookName, chapter, verseNum) => {
    const text = `«${verseText}» — ${bookName} ${chapter}:${verseNum}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const oldTestamentBooks = BIBLE_BOOKS.filter(b => b.testament === 'old');
  const newTestamentBooks = BIBLE_BOOKS.filter(b => b.testament === 'new');
  const isRTL = selectedTranslation.dir === 'rtl';

  return (
    <div className="bible-page">

      {/* ===== Professional Bible Banner ===== */}
      <div className="bible-banner">
        <div className="bible-banner-inner container">
          {/* Title */}
          <div className="bible-banner-title">
            <div className="bible-banner-icon"><BookOpen size={28} /></div>
            <div>
              <h1>{t('bible.title')}</h1>
              <p>{t('bible.subtitle')}</p>
            </div>
          </div>

          {/* Controls row */}
          <div className="bible-banner-controls">
            {/* Translation */}
            <div className="banner-control">
              <label className="banner-label"><BookMarked size={13} /> {language === 'ar' ? 'الترجمة' : 'Translation'}</label>
              <select
                className="banner-select"
                value={selectedTranslation.id}
                onChange={e => setSelectedTranslation(TRANSLATIONS.find(t => t.id === e.target.value))}
              >
                <optgroup label={language === 'ar' ? 'ترجمات عربية' : 'Arabic Translations'}>
                  {TRANSLATIONS.filter(t => t.lang === 'ar').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
                <optgroup label="English">
                  {TRANSLATIONS.filter(t => t.lang === 'en').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Book */}
            <div className="banner-control">
              <label className="banner-label"><BookOpen size={13} /> {t('bible.selectBook')}</label>
              <button className="banner-book-btn" onClick={() => setShowBookList(true)}>
                <span>{language === 'ar' ? selectedBook.name : (selectedBook.nameEn || selectedBook.name)}</span>
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Chapter */}
            <div className="banner-control">
              <label className="banner-label"><Search size={13} /> {t('bible.selectChapter')}</label>
              <div className="banner-chapter-nav">
                <button className="banner-nav-btn" onClick={prevChapter} disabled={selectedChapter <= 1}>
                  <ChevronRight size={16} />
                </button>
                <select
                  className="banner-select"
                  value={selectedChapter}
                  onChange={e => setSelectedChapter(Number(e.target.value))}
                >
                  {chapterOptions.map(ch => (
                    <option key={ch} value={ch}>{ch}</option>
                  ))}
                </select>
                <button className="banner-nav-btn" onClick={nextChapter} disabled={selectedChapter >= selectedBook.chapters}>
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Modal */}
      {showBookList && (
        <div className="book-modal-overlay" onClick={() => setShowBookList(false)}>
          <div className="book-modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="book-modal-header">
              <h3><BookOpen size={20} /> {t('bible.selectBook')}</h3>
              <button className="book-modal-close" onClick={() => setShowBookList(false)}>✕</button>
            </div>
            <div className="testament-tabs">
              <button className={`test-tab ${activeTestament === 'old' ? 'active' : ''}`} onClick={() => setActiveTestament('old')}>
                {t('bible.oldTestament')} ({oldTestamentBooks.length})
              </button>
              <button className={`test-tab ${activeTestament === 'new' ? 'active' : ''}`} onClick={() => setActiveTestament('new')}>
                {t('bible.newTestament')} ({newTestamentBooks.length})
              </button>
            </div>
            <div className="book-grid-modal">
              {(activeTestament === 'old' ? oldTestamentBooks : newTestamentBooks).map(book => (
                <button
                  key={book.id}
                  className={`book-item ${selectedBook.id === book.id ? 'active' : ''}`}
                  onClick={() => handleBookSelect(book)}
                >
                  {language === 'ar' ? book.name : (book.nameEn || book.name)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bible-container container">

        {/* Reading header */}
        <div className="bible-reading-header">
          {showFavoritesOnly ? (
            <div className="reading-title-block">
              <span className="testament-badge" style={{ background: 'var(--accent-color)', color: 'var(--primary-color)' }}>{language === 'ar' ? 'مفضلتي' : 'Favorites'}</span>
              <h2>{language === 'ar' ? 'الآيات المفضلة 🌟' : 'Favorite Verses 🌟'}</h2>
              <span className="translation-badge">{language === 'ar' ? 'إجمالي الآيات المحفوظة' : 'Total saved verses'}: {favorites.length}</span>
            </div>
          ) : (
            <div className="reading-title-block">
              <span className="testament-badge">{selectedBook.testament === 'old' ? t('bible.oldTestament') : t('bible.newTestament')}</span>
              <h2>{language === 'ar' ? selectedBook.name : (selectedBook.nameEn || selectedBook.name)} — {language === 'ar' ? `الإصحاح ${selectedChapter}` : `Chapter ${selectedChapter}`}</h2>
              <span className="translation-badge">{selectedTranslation.name}</span>
            </div>
          )}
          <div className="chapter-quick-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className={`btn ${showFavoritesOnly ? 'btn-accent' : 'btn-outline'}`} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 'bold' }}>
              <Star size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              <span>{showFavoritesOnly ? (language === 'ar' ? 'العودة للقراءة' : 'Back to Scripture') : (language === 'ar' ? `الآيات المفضلة (${favorites.length})` : `Favorite Verses (${favorites.length})`)}</span>
            </button>
            {!showFavoritesOnly && (
              <>
                <button className="btn btn-outline chapter-nav-large" onClick={prevChapter} disabled={selectedChapter <= 1}>
                  <ChevronRight size={16} /> {language === 'ar' ? 'السابق' : 'Previous'}
                </button>
                <span className="chapter-counter">{selectedChapter} / {selectedBook.chapters}</span>
                <button className="btn btn-outline chapter-nav-large" onClick={nextChapter} disabled={selectedChapter >= selectedBook.chapters}>
                  {language === 'ar' ? 'التالي' : 'Next'} <ChevronLeft size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Verses */}
        <div className="bible-reading-area glass-card" ref={versesRef}>
          {showFavoritesOnly ? (
            favorites.length === 0 ? (
              <div className="bible-empty" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                <Star size={40} style={{ color: 'var(--accent-color)', opacity: 0.5, marginBottom: '1rem' }} />
                <p>قائمتك المفضلة فارغة حالياً. يمكنك تصفح الأسفار والنقر على نجمة (⭐) بجانب أي آية لحفظها هنا.</p>
              </div>
            ) : (
              <div className="verses-container rtl-text" dir="rtl">
                {favorites.map((fav) => (
                  <div key={fav.key} className="verse-item favorite-item-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', borderBottom: '1px solid var(--border-color)', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="bible-ref-badge" style={{ background: 'var(--accent-color)', color: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {fav.bookName} {fav.chapter}:{fav.verseNum}
                      </span>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="copy-verse-btn" onClick={() => copyVerse(fav.text, `${fav.bookName}_${fav.chapter}_${fav.verseNum}`)} title="نسخ">
                          {copiedVerse === `${fav.bookName}_${fav.chapter}_${fav.verseNum}` ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                        <button className="copy-verse-btn" onClick={() => shareVerse(fav.text, fav.bookName, fav.chapter, fav.verseNum)} title="مشاركة واتساب">
                          <Share2 size={13} />
                        </button>
                        <button className="copy-verse-btn" onClick={() => toggleFavorite(fav.bookId, fav.bookName, fav.chapter, fav.verseNum, fav.text)} title="حذف من المفضلة" style={{ color: 'var(--error-color)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <span className="verse-text" style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '0.25rem', lineHeight: '1.6' }}>{fav.text}</span>
                  </div>
                ))}
              </div>
            )
          ) : loading ? (
            <div className="bible-loading">
              <div className="loading-spinner"></div>
              <p>جارٍ تحميل الآيات...</p>
            </div>
          ) : error ? (
            <div className="bible-error">
              <p>⚠️ {error}</p>
              <button className="btn btn-primary" onClick={fetchChapter}>
                <RefreshCw size={16} /> إعادة المحاولة
              </button>
            </div>
          ) : verses.length === 0 ? (
            <div className="bible-empty">
              <BookOpen size={40} />
              <p>اختر سفراً وإصحاحاً لبدء القراءة</p>
            </div>
          ) : (
            <div className={`verses-container ${isRTL ? 'rtl-text' : 'ltr-text'}`} dir={selectedTranslation.dir}>
              {verses.map((verse) => {
                const verseNum = verse.number;
                const verseText = extractVerseText(verse.content);
                const isFav = favorites.some(f => f.bookId === selectedBook.id && f.chapter === selectedChapter && f.verseNum === verseNum);
                return (
                  <div key={verseNum} className="verse-item" id={`verse-${verseNum}`}>
                    <span className="verse-number">{verseNum}</span>
                    <span className="verse-text">{verseText}</span>
                    <div className="verse-actions" style={{ display: 'flex', gap: '0.4rem', marginRight: 'auto', marginLeft: isRTL ? '0' : 'auto', marginRight: isRTL ? 'auto' : '0' }}>
                      <button
                        className={`copy-verse-btn ${copiedVerse === verseNum ? 'copied' : ''}`}
                        onClick={() => copyVerse(verseText, verseNum)}
                        title="نسخ الآية"
                      >
                        {copiedVerse === verseNum ? <Check size={13} /> : <Copy size={13} />}
                      </button>
                      <button
                        className="copy-verse-btn"
                        onClick={() => shareVerse(verseText, selectedBook.name, selectedChapter, verseNum)}
                        title="مشاركة عبر واتساب"
                      >
                        <Share2 size={13} />
                      </button>
                      <button
                        className={`copy-verse-btn ${isFav ? 'active-fav' : ''}`}
                        onClick={() => toggleFavorite(selectedBook.id, selectedBook.name, selectedChapter, verseNum, verseText)}
                        title={isFav ? "حذف من المفضلة" : "إضافة للمفضلة"}
                      >
                        <Star size={13} fill={isFav ? 'var(--accent-color)' : 'none'} style={{ color: isFav ? 'var(--accent-color)' : 'inherit' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom nav */}
        {verses.length > 0 && !showFavoritesOnly && (
          <div className="bible-bottom-nav">
            <button className="btn btn-primary" onClick={prevChapter} disabled={selectedChapter <= 1}>
              <ChevronRight size={18} /> الإصحاح السابق
            </button>
            <div className="bottom-nav-info">
              <strong>{selectedBook.name}</strong>
              <span> — الإصحاح {selectedChapter} من {selectedBook.chapters}</span>
            </div>
            <button className="btn btn-primary" onClick={nextChapter} disabled={selectedChapter >= selectedBook.chapters}>
              الإصحاح التالي <ChevronLeft size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .bible-page { min-height: 100vh; background: var(--bg-secondary); }

        /* ===== Professional Bible Banner ===== */
        .bible-banner {
          background: linear-gradient(135deg, var(--primary-color) 0%, #0c2240 60%, #1a3a6b 100%);
          padding: 2.5rem 0 2rem;
          position: relative;
          overflow: hidden;
        }
        .bible-banner::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at top right, rgba(197,168,128,0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        [data-theme="dark"] .bible-banner { background: linear-gradient(135deg, #0a1628 0%, #0d1f35 60%, #111e30 100%); }
        .bible-banner-inner {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .bible-banner-title {
          display: flex; align-items: center; gap: 1rem;
          color: white;
        }
        .bible-banner-icon {
          width: 52px; height: 52px; flex-shrink: 0;
          background: rgba(197,168,128,0.18);
          border: 1.5px solid rgba(197,168,128,0.4);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent-color);
          backdrop-filter: blur(6px);
        }
        .bible-banner-title h1 { font-size: 1.7rem; font-weight: 800; margin: 0; color: white; line-height: 1.2; }
        .bible-banner-title p { font-size: 0.88rem; margin: 0.25rem 0 0; opacity: 0.7; color: white; }

        /* Controls row inside banner */
        .bible-banner-controls {
          display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end;
        }
        .banner-control {
          display: flex; flex-direction: column; gap: 0.35rem;
          flex: 1; min-width: 170px;
        }
        .banner-label {
          font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.65);
          display: flex; align-items: center; gap: 0.35rem;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .banner-select {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white;
          padding: 0.6rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem; font-family: inherit;
          cursor: pointer; transition: var(--transition);
          width: 100%; backdrop-filter: blur(4px);
        }
        .banner-select:focus { outline: none; border-color: var(--accent-color); background: rgba(255,255,255,0.18); }
        .banner-select option { background: var(--bg-primary); color: var(--text-primary); }
        .banner-book-btn {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white;
          padding: 0.6rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.95rem; font-family: inherit;
          cursor: pointer; transition: var(--transition);
          display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;
          width: 100%; text-align: right; backdrop-filter: blur(4px);
        }
        .banner-book-btn:hover { background: rgba(255,255,255,0.2); border-color: var(--accent-color); }
        .banner-chapter-nav { display: flex; align-items: center; gap: 0.4rem; }
        .banner-nav-btn {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white;
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: var(--transition);
        }
        .banner-nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.25); border-color: var(--accent-color); }
        .banner-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .bible-container { padding-top: 2rem; padding-bottom: 3rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .bible-book-btn svg.rotated { transform: rotate(180deg); }

        /* Book Modal */
        .book-modal-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .book-modal {
          width: 100%; max-width: 680px;
          max-height: 85vh;
          display: flex; flex-direction: column;
          padding: 0;
          overflow: hidden;
          animation: slideUp 0.25s ease;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 60px rgba(0,0,0,0.35);
        }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .book-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .book-modal-header h3 {
          margin: 0; font-size: 1.15rem;
          color: var(--primary-color);
          display: flex; align-items: center; gap: 0.5rem;
        }
        [data-theme="dark"] .book-modal-header h3 { color: var(--accent-color); }
        .book-modal-close {
          background: transparent; border: none; cursor: pointer;
          font-size: 1.2rem; color: var(--text-secondary);
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: var(--transition);
        }
        .book-modal-close:hover { background: var(--border-color); color: var(--text-primary); }
        .testament-tabs {
          display: flex; gap: 0.5rem;
          padding: 1rem 1.5rem 0.75rem;
          border-bottom: 1px solid var(--border-color);
          flex-shrink: 0;
        }
        .test-tab { background: transparent; border: 1.5px solid var(--border-color); color: var(--text-secondary); padding: 0.5rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: var(--transition); font-family: inherit; }
        .test-tab:hover, .test-tab.active { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        [data-theme="dark"] .test-tab:hover, [data-theme="dark"] .test-tab.active { background: var(--accent-color); border-color: var(--accent-color); color: var(--bg-primary); }
        .book-grid-modal {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          padding: 1.25rem 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .book-item { background: var(--bg-primary); border: 1.5px solid var(--border-color); color: var(--text-primary); padding: 0.65rem 0.75rem; border-radius: var(--radius-md); font-size: 0.9rem; font-family: inherit; cursor: pointer; transition: var(--transition); text-align: center; font-weight: 600; }
        .book-item:hover { background: rgba(26,54,93,0.07); border-color: var(--primary-color); color: var(--primary-color); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
        [data-theme="dark"] .book-item:hover { background: rgba(197,168,128,0.1); border-color: var(--accent-color); color: var(--accent-color); }
        .book-item.active { background: var(--primary-color); color: white; border-color: var(--primary-color); font-weight: 700; box-shadow: var(--shadow-sm); }
        [data-theme="dark"] .book-item.active { background: var(--accent-color); border-color: var(--accent-color); color: var(--bg-primary); }

        .chapter-nav { display: flex; align-items: center; gap: 0.5rem; }
        .chapter-select { flex: 1; }
        .chapter-nav-btn { background: var(--bg-primary); border: 1.5px solid var(--border-color); color: var(--text-primary); width: 38px; height: 38px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); flex-shrink: 0; }
        .chapter-nav-btn:hover:not(:disabled) { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        [data-theme="dark"] .chapter-nav-btn:hover:not(:disabled) { background: var(--accent-color); border-color: var(--accent-color); color: var(--bg-primary); }
        .chapter-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .bible-reading-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .reading-title-block { display: flex; flex-direction: column; gap: 0.35rem; }
        .reading-title-block h2 { font-size: 1.6rem; color: var(--primary-color); margin: 0; }
        [data-theme="dark"] .reading-title-block h2 { color: var(--accent-color); }
        .testament-badge { font-size: 0.75rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; }
        .translation-badge { font-size: 0.85rem; color: var(--text-secondary); background: var(--bg-secondary); border: 1px solid var(--border-color); padding: 0.2rem 0.7rem; border-radius: 999px; width: fit-content; }
        .chapter-quick-nav { display: flex; align-items: center; gap: 1rem; }
        .chapter-counter { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); min-width: 60px; text-align: center; }
        .chapter-nav-large { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; padding: 0.5rem 1rem; }
        .btn-outline { background: transparent; border: 1.5px solid var(--border-color); color: var(--text-primary); cursor: pointer; border-radius: var(--radius-md); font-family: inherit; transition: var(--transition); }
        .btn-outline:hover:not(:disabled) { border-color: var(--primary-color); color: var(--primary-color); }
        [data-theme="dark"] .btn-outline:hover:not(:disabled) { border-color: var(--accent-color); color: var(--accent-color); }
        .btn-outline:disabled { opacity: 0.35; cursor: not-allowed; }

        .bible-reading-area { padding: 2rem 2.5rem; min-height: 300px; }
        .bible-loading, .bible-error, .bible-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.25rem; padding: 3rem; color: var(--text-secondary); text-align: center; }
        .bible-error { color: var(--error-color); }

        .verses-container { display: flex; flex-direction: column; gap: 0; }
        .rtl-text { direction: rtl; text-align: right; }
        .ltr-text { direction: ltr; text-align: left; }
        .verse-item { display: flex; align-items: flex-start; gap: 1rem; padding: 0.9rem 0.75rem; border-bottom: 1px solid var(--border-color); border-radius: var(--radius-sm); transition: background 0.15s; position: relative; }
        .verse-item:last-child { border-bottom: none; }
        .verse-item:hover { background: rgba(26,54,93,0.03); }
        [data-theme="dark"] .verse-item:hover { background: rgba(255,255,255,0.03); }
        .verse-number { flex-shrink: 0; width: 28px; height: 28px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; margin-top: 0.2rem; }
        [data-theme="dark"] .verse-number { background: var(--accent-color); color: var(--bg-primary); }
        .verse-text { flex: 1; font-size: 1.2rem; line-height: 2; color: var(--text-primary); font-weight: 400; }
        .copy-verse-btn { flex-shrink: 0; background: transparent; border: 1px solid var(--border-color); color: var(--text-light); width: 26px; height: 26px; border-radius: var(--radius-sm); cursor: pointer; display: flex; align-items: center; justify-content: center; opacity: 0; transition: var(--transition); margin-top: 0.4rem; }
        .verse-item:hover .copy-verse-btn { opacity: 1; }
        .copy-verse-btn:hover, .copy-verse-btn.copied { background: var(--primary-color); border-color: var(--primary-color); color: white; opacity: 1; }
        [data-theme="dark"] .copy-verse-btn:hover, [data-theme="dark"] .copy-verse-btn.copied { background: var(--accent-color); border-color: var(--accent-color); color: var(--bg-primary); }

        .bible-bottom-nav { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 0; border-top: 1px solid var(--border-color); }
        .bottom-nav-info { font-size: 0.95rem; color: var(--text-secondary); text-align: center; }
        .bottom-nav-info strong { color: var(--primary-color); }
        [data-theme="dark"] .bottom-nav-info strong { color: var(--accent-color); }

        @media (max-width: 768px) {
          .bible-hero-content h1 { font-size: 1.8rem; }
          .bible-controls { flex-direction: column; }
          .control-group { min-width: 100%; }
          .book-dropdown { min-width: 100%; }
          .book-grid { grid-template-columns: repeat(2, 1fr); }
          .bible-reading-header { flex-direction: column; align-items: flex-start; }
          .chapter-quick-nav { width: 100%; justify-content: center; }
          .bible-reading-area { padding: 1.25rem; }
          .verse-text { font-size: 1.05rem; }
          .bible-bottom-nav { flex-direction: column; gap: 1rem; text-align: center; }
          .bible-bottom-nav .btn { width: 100%; justify-content: center; }
        }
        @media (max-width: 400px) {
          .book-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Bible;
