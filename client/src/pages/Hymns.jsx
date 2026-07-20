import React, { useEffect, useState } from 'react';
import { Search, Music, Play, Video, ChevronDown, ChevronUp, ExternalLink, Library } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ARABIC_LETTERS = ['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];

const Hymns = () => {
  const [hymns, setHymns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeHymnId, setActiveHymnId] = useState(null);
  const [activeTab, setActiveTab] = useState('lyrics'); // 'lyrics' or 'video'
  const [selectedLetter, setSelectedLetter] = useState('الكل');
  const { t, language, translateText } = useLanguage();

  const fetchHymns = () => {
    setLoading(true);
    fetch(`/api/hymns?search=${search}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setHymns(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHymns();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHymns();
  };

  const toggleHymn = (id) => {
    if (activeHymnId === id) {
      setActiveHymnId(null);
    } else {
      setActiveHymnId(id);
    }
  };

  const cleanYoutubeUrl = (url) => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  // Normalize Arabic letter for matching (handle أ/إ/ا variants)
  const normalizeArabic = (str) => {
    if (!str) return '';
    return str
      .replace(/[أإآا]/g, 'أ')
      .trim();
  };

  // Filter items based on active tab AND selected letter
  const filteredHymns = hymns.filter(hymn => {
    // Tab filter
    if (activeTab === 'video') {
      if (!hymn.videoUrl || hymn.videoUrl.trim() === '') return false;
    }
    // Letter filter
    if (selectedLetter !== 'الكل' && selectedLetter !== 'All') {
      const firstChar = normalizeArabic(hymn.title?.charAt(0));
      const targetChar = normalizeArabic(selectedLetter);
      if (firstChar !== targetChar) return false;
    }
    return true;
  });

  // Count hymns per letter for display
  const getLetterCount = (letter) => {
    return hymns.filter(hymn => {
      const firstChar = normalizeArabic(hymn.title?.charAt(0));
      const targetChar = normalizeArabic(letter);
      return firstChar === targetChar;
    }).length;
  };

  return (
    <div className="hymns-page container">
      <h1 className="section-title">{t('hymns.title')}</h1>
      
      <p className="page-intro">
        {t('hymns.subtitle')}
      </p>

          {/* Navigation Tabs */}
          <div className="hymns-tabs">
            <button 
              onClick={() => setActiveTab('lyrics')}
              className={`tab-btn ${activeTab === 'lyrics' ? 'active' : ''}`}
            >
              <Music size={18} />
              <span>{t('hymns.lyrics')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('video')}
              className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            >
              <Video size={18} />
              <span>{t('hymns.watchVideo')}</span>
            </button>
          </div>

          {/* Search form (Only for Lyrics tab) */}
          {activeTab === 'lyrics' && (
            <div className="search-wrapper glass-card">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-input-group">
                  <input 
                    type="text" 
                    placeholder={t('common.searchPlaceholder')} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                  />
                  <button type="submit" className="btn btn-primary search-btn">
                    <Search size={18} />
                    <span>{t('common.search')}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Alphabetical Filter Bar */}
          <div className="alpha-filter-section glass-card">
            <div className="alpha-filter-label">
              <span>🔤 {language === 'ar' ? 'تصفح حسب الحرف:' : 'Browse by Letter:'}</span>
            </div>
            <div className="alpha-filter-bar">
              <button
                className={`alpha-btn ${selectedLetter === 'الكل' || selectedLetter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedLetter('الكل')}
              >
                {t('common.all')}
                <span className="alpha-count">{hymns.length}</span>
              </button>
              {ARABIC_LETTERS.map(letter => {
                const count = getLetterCount(letter);
                return (
                  <button
                    key={letter}
                    className={`alpha-btn ${selectedLetter === letter ? 'active' : ''} ${count === 0 ? 'empty' : ''}`}
                    onClick={() => setSelectedLetter(letter)}
                    disabled={count === 0}
                  >
                    {letter}
                    {count > 0 && <span className="alpha-count">{count}</span>}
                  </button>
                );
              })}
            </div>
            {selectedLetter !== 'الكل' && selectedLetter !== 'All' && (
              <div className="alpha-result-info">
                {language === 'ar' ? 'يعرض الترانيم التي تبدأ بحرف:' : 'Showing hymns starting with:'} <strong>{selectedLetter}</strong>
                {filteredHymns.length === 0 && (language === 'ar' ? ' — لا توجد ترانيم بهذا الحرف' : ' — No hymns for this letter')}
              </div>
            )}
          </div>

          {/* Hymns Render Area */}
          {loading ? (
            <div className="flex-center" style={{ minHeight: '200px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : filteredHymns.length === 0 ? (
            <div className="no-data-card glass-card">
              <p className="no-data">{t('common.noData')}</p>
            </div>
          ) : activeTab === 'lyrics' ? (
            /* Lyrics Accordion View */
            <div className="hymns-list">
              {filteredHymns.map((hymn) => {
                const isOpen = activeHymnId === hymn._id;
                return (
                  <div className={`hymn-accordion-card glass-card ${isOpen ? 'open' : ''}`} key={hymn._id}>
                    <div className="accordion-header" onClick={() => toggleHymn(hymn._id)}>
                      <div className="header-title-wrapper">
                        <Music className="music-icon" size={20} />
                        <h3>{translateText(hymn.title, hymn.titleEn)}</h3>
                        {hymn.category && <span className="hymn-cat-badge">{translateText(hymn.category, hymn.categoryEn)}</span>}
                      </div>
                      <div className="header-toggle-icon">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="accordion-content">
                        <div className="lyrics-display">
                          {hymn.lyrics}
                        </div>

                        {/* Media attachments */}
                        {(hymn.audioUrl || hymn.videoUrl) && (
                          <div className="hymn-media-section">
                            <h4>الوسائط المرفقة للتدريب أو الاستماع</h4>
                            <div className="hymn-media-grid">
                              {hymn.videoUrl && (
                                <div className="hymn-video">
                                  <iframe
                                    width="100%"
                                    height="220"
                                    src={cleanYoutubeUrl(hymn.videoUrl)}
                                    title={hymn.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    style={{ borderRadius: 'var(--radius-md)' }}
                                  ></iframe>
                                </div>
                              )}

                              {hymn.audioUrl && (
                                <div className="hymn-audio">
                                  <p>ملف صوتي للتدريب والاستماع:</p>
                                  <audio 
                                    src={hymn.audioUrl} 
                                    controls 
                                    style={{ width: '100%', marginTop: '0.5rem' }}
                                  ></audio>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Video Hymns Grid View */
            <div className="grid-2 video-hymns-grid">
              {filteredHymns.map((hymn) => (
                <div className="video-hymn-card glass-card" key={hymn._id}>
                  <div className="video-card-header">
                    <h3>{hymn.title}</h3>
                    {hymn.category && <span className="hymn-cat-badge">{hymn.category}</span>}
                  </div>
                  <div className="video-container-wrapper">
                    <iframe
                      width="100%"
                      height="260"
                      src={cleanYoutubeUrl(hymn.videoUrl)}
                      title={hymn.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      style={{ borderRadius: 'var(--radius-md)', display: 'block' }}
                    ></iframe>
                  </div>
                  {hymn.lyrics && (
                    <details className="lyrics-dropdown-details">
                      <summary>عرض الكلمات المصاحبة</summary>
                      <div className="lyrics-dropdown-content">
                        {hymn.lyrics}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

      <style>{`
        .hymns-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .page-intro {
          text-align: center;
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.7;
        }
        
        /* Tasbeehna Widget */
        .tasbeehna-widget {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 2.5rem;
          gap: 2rem;
          border-right: 4px solid var(--accent-color);
          border-left: 0;
          background: rgba(197, 168, 128, 0.05);
        }
        .widget-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        .widget-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .widget-text h3 {
          font-size: 1.3rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .widget-text h3 {
          color: var(--accent-color);
        }
        .widget-text p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .widget-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .tasbeehna-widget {
            flex-direction: column;
            text-align: center;
            padding: 1.5rem;
          }
          .widget-btn {
            width: 100%;
          }
        }

        /* Tabs styling */
        .hymns-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.5rem;
        }
        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 0.75rem 2rem;
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          transition: var(--transition);
        }
        .tab-btn:hover {
          color: var(--primary-color);
        }
        [data-theme="dark"] .tab-btn:hover {
          color: var(--accent-color);
        }
        .tab-btn.active {
          color: var(--primary-color);
        }
        [data-theme="dark"] .tab-btn.active {
          color: var(--accent-color);
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--primary-color);
          border-radius: 999px;
        }
        [data-theme="dark"] .tab-btn.active::after {
          background-color: var(--accent-color);
        }

        .search-wrapper {
          padding: 1.25rem;
        }
        .search-input-group {
          display: flex;
          gap: 0.75rem;
        }
        .search-input-group input {
          flex: 1;
        }
        @media (max-width: 576px) {
          .search-input-group {
            flex-direction: column;
          }
        }

        /* Alphabetical Filter */
        .alpha-filter-section {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .alpha-filter-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .alpha-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .alpha-btn {
          position: relative;
          background: var(--bg-primary);
          border: 1.5px solid var(--border-color);
          color: var(--text-primary);
          width: 2.6rem;
          height: 2.6rem;
          border-radius: var(--radius-sm);
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .alpha-btn:first-child {
          width: auto;
          padding: 0 1rem;
          font-size: 0.9rem;
        }
        .alpha-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26,54,93,0.2);
        }
        [data-theme="dark"] .alpha-btn:hover:not(:disabled) {
          background: var(--accent-color);
          border-color: var(--accent-color);
          box-shadow: 0 4px 12px rgba(197,168,128,0.25);
        }
        .alpha-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(26,54,93,0.25);
        }
        [data-theme="dark"] .alpha-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: var(--bg-primary);
          box-shadow: 0 4px 12px rgba(197,168,128,0.3);
        }
        .alpha-btn.empty {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .alpha-count {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--accent-color);
          color: var(--bg-primary);
          font-size: 0.6rem;
          font-weight: 800;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .alpha-btn.active .alpha-count {
          background: white;
          color: var(--primary-color);
        }
        [data-theme="dark"] .alpha-btn.active .alpha-count {
          background: var(--bg-primary);
          color: var(--accent-color);
        }
        .alpha-btn:first-child .alpha-count {
          position: static;
          margin-right: 0;
          margin-left: 0.35rem;
          width: auto;
          height: auto;
          padding: 0.1rem 0.35rem;
          border-radius: 999px;
          font-size: 0.7rem;
        }
        .alpha-result-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: rgba(197, 168, 128, 0.08);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          border-right: 3px solid var(--accent-color);
        }
        .alpha-result-info strong {
          color: var(--primary-color);
        }
        [data-theme="dark"] .alpha-result-info strong {
          color: var(--accent-color);
        }
        .no-data-card {
          padding: 3rem;
          text-align: center;
        }
        
        .hymns-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .hymn-accordion-card {
          padding: 0;
          overflow: hidden;
          transition: var(--transition);
        }
        .accordion-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
          transition: var(--transition);
        }
        .accordion-header:hover {
          background-color: rgba(26, 54, 93, 0.02);
        }
        [data-theme="dark"] .accordion-header:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .header-title-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .music-icon {
          color: var(--accent-color);
        }
        .hymn-accordion-card h3 {
          font-size: 1.15rem;
          margin: 0;
        }
        .hymn-cat-badge {
          background-color: rgba(197, 168, 128, 0.15);
          color: var(--accent-color);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .header-toggle-icon {
          color: var(--text-light);
        }
        .accordion-content {
          padding: 0 1.5rem 1.5rem 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background-color: var(--bg-secondary);
        }
        .lyrics-display {
          font-size: 1.15rem;
          color: var(--text-primary);
          text-align: center;
          line-height: 2.1;
          white-space: pre-line;
          padding: 1.5rem 0;
          font-weight: 500;
        }
        .hymn-media-section {
          border-top: 1px dashed var(--border-color);
          padding-top: 1.5rem;
        }
        .hymn-media-section h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .hymn-media-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .hymn-media-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        .hymn-audio {
          background-color: var(--bg-primary);
          padding: 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Video Hymns Grid View */
        .video-hymns-grid {
          margin-top: 1rem;
        }
        .video-hymn-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .video-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .video-card-header h3 {
          font-size: 1.2rem;
          margin: 0;
        }
        .video-container-wrapper {
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: black;
          box-shadow: var(--shadow-sm);
        }
        .lyrics-dropdown-details {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          background-color: var(--bg-primary);
        }
        .lyrics-dropdown-details summary {
          font-weight: 700;
          cursor: pointer;
          outline: none;
          color: var(--primary-color);
        }
        [data-theme="dark"] .lyrics-dropdown-details summary {
          color: var(--accent-color);
        }
        .lyrics-dropdown-content {
          margin-top: 0.75rem;
          white-space: pre-line;
          line-height: 1.8;
          text-align: center;
          font-size: 0.95rem;
          border-top: 1px dashed var(--border-color);
          padding-top: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default Hymns;
