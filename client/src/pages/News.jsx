import React, { useEffect, useState } from 'react';
import { Calendar, Tag, ChevronLeft, ZoomIn, ZoomOut, X, Download, ExternalLink, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeImage, setActiveImage] = useState(null); // { url, title }
  const [isZoomedFull, setIsZoomedFull] = useState(false);
  const { t, language, translateText } = useLanguage();
  const isAr = language === 'ar';

  const fetchNews = () => {
    setLoading(true);
    let url = '/api/news';
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setNews(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
        setIsZoomedFull(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-LB' : 'en-US', options);
  };

  const openImageModal = (imageUrl, title) => {
    setActiveImage({ url: imageUrl, title });
    setIsZoomedFull(false);
  };

  const closeImageModal = () => {
    setActiveImage(null);
    setIsZoomedFull(false);
  };

  return (
    <div className="news-page container">
      <h1 className="section-title">{t('news.title')}</h1>
      
      <p className="page-intro">
        {t('news.subtitle')}
      </p>

      {/* Category filters */}
      <div className="category-filters">
        <button 
          onClick={() => setSelectedCategory('')}
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
        >
          {t('news.allCategories')}
        </button>
        <button 
          onClick={() => setSelectedCategory('news')}
          className={`filter-btn ${selectedCategory === 'news' ? 'active' : ''}`}
        >
          {t('news.generalNewsOnly')}
        </button>
        <button 
          onClick={() => setSelectedCategory('announcement')}
          className={`filter-btn ${selectedCategory === 'announcement' ? 'active' : ''}`}
        >
          {t('news.announcementsOnly')}
        </button>
        <button 
          onClick={() => setSelectedCategory('event')}
          className={`filter-btn ${selectedCategory === 'event' ? 'active' : ''}`}
        >
          {t('news.eventsOnly')}
        </button>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : news.length === 0 ? (
        <p className="no-data">{t('news.noNewsFound')}</p>
      ) : (
        <div className="grid-3 news-grid">
          {news.map((item) => {
            const itemTitle = translateText(item.title, item.titleEn);
            return (
              <article className="news-card glass-card" key={item._id}>
                {item.imageUrl && (
                  <div 
                    className="news-image-wrapper"
                    onClick={() => openImageModal(item.imageUrl, itemTitle)}
                    title={isAr ? 'اضغط لتكبير الصورة بدقة كاملة' : 'Click to view full image'}
                  >
                    <img src={item.imageUrl} alt={item.title} className="news-card-image" />
                    <div className="image-zoom-overlay">
                      <Maximize2 size={24} />
                      <span>{isAr ? 'تكبير الصورة' : 'Enlarge Image'}</span>
                    </div>
                  </div>
                )}
                
                <div className="news-card-content">
                  <div className="news-card-meta">
                    <span className={`news-tag ${item.category}`}>
                      {item.category === 'event' ? t('common.event') : item.category === 'announcement' ? t('common.announcement') : t('common.newsItem')}
                    </span>
                    <div className="news-date">
                      <Calendar size={14} />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>

                  <h3>{itemTitle}</h3>
                  
                  <p className="news-excerpt">
                    {translateText(item.content, item.contentEn)}
                  </p>

                  {item.imageUrl && (
                    <button 
                      type="button" 
                      className="view-image-link-btn"
                      onClick={() => openImageModal(item.imageUrl, itemTitle)}
                    >
                      <Maximize2 size={16} />
                      <span>{isAr ? 'عرض وتكبير صورة الإعلان' : 'View Full Image'}</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ================= LIGHTBOX / IMAGE MODAL ================= */}
      {activeImage && (
        <div className="image-lightbox-backdrop" onClick={closeImageModal}>
          <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Toolbar */}
            <div className="lightbox-toolbar">
              <div className="lightbox-title">
                {activeImage.title}
              </div>
              <div className="lightbox-actions">
                <button 
                  className="lightbox-btn" 
                  onClick={() => setIsZoomedFull(!isZoomedFull)}
                  title={isZoomedFull ? (isAr ? 'تصغير' : 'Zoom Out') : (isAr ? 'تكبير إضافي' : 'Zoom In')}
                >
                  {isZoomedFull ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                  <span>{isZoomedFull ? (isAr ? 'ملاءمة الشاشة' : 'Fit') : (isAr ? 'تكبير 100%' : '100%')}</span>
                </button>
                
                <a 
                  href={activeImage.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="lightbox-btn"
                  title={isAr ? 'فتح في نافذة جديدة' : 'Open in new tab'}
                >
                  <ExternalLink size={20} />
                </a>

                <a 
                  href={activeImage.url} 
                  download 
                  className="lightbox-btn"
                  title={isAr ? 'تحميل الصورة' : 'Download image'}
                >
                  <Download size={20} />
                </a>

                <button 
                  className="lightbox-btn close-btn" 
                  onClick={closeImageModal}
                  title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Main Image Display Area */}
            <div className={`lightbox-body ${isZoomedFull ? 'scrollable' : ''}`}>
              <img 
                src={activeImage.url} 
                alt={activeImage.title} 
                className={`lightbox-img ${isZoomedFull ? 'zoomed-in' : 'fit-screen'}`}
                onClick={() => setIsZoomedFull(!isZoomedFull)}
              />
            </div>

            {/* Bottom Tip */}
            <div className="lightbox-footer-tip">
              <span>{isAr ? '💡 نصيحة: يمكنك النقر على الصورة للتبديل بين التكبير وملاءمة الشاشة' : '💡 Tip: Click the image to toggle zoom'}</span>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .news-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding-bottom: 5rem;
        }
        .page-intro {
          text-align: center;
          font-size: 1.15rem;
          color: var(--text-secondary);
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .category-filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          padding: 0.5rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .filter-btn:hover, .filter-btn.active {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        [data-theme="dark"] .filter-btn.active {
          background-color: var(--accent-color);
          color: var(--primary-dark);
          border-color: var(--accent-color);
        }

        .news-grid {
          margin-top: 1rem;
        }
        .news-card {
          padding: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
          border-radius: 16px;
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .news-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .news-image-wrapper {
          position: relative;
          width: 100%;
          height: 240px;
          overflow: hidden;
          background-color: #0f172a;
          cursor: pointer;
        }
        .news-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
        }
        .image-zoom-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.95rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .news-image-wrapper:hover .news-card-image {
          transform: scale(1.08);
        }
        .news-image-wrapper:hover .image-zoom-overlay {
          opacity: 1;
        }

        .news-card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-grow: 1;
        }
        .news-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-light);
        }
        .news-tag {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.6rem;
          border-radius: 9999px;
        }
        .news-tag.event { background: #dcfce7; color: #166534; }
        .news-tag.announcement { background: #fef3c7; color: #92400e; }
        .news-tag.news { background: #dbeafe; color: #1e40af; }
        
        .news-date {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .news-card-content h3 {
          font-size: 1.25rem;
          margin: 0;
          line-height: 1.4;
          color: var(--text-primary);
        }
        .news-excerpt {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-wrap;
          flex-grow: 1;
        }

        .view-image-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(197, 168, 128, 0.15);
          color: var(--accent-color, #c5a880);
          border: 1px solid rgba(197, 168, 128, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.5rem;
          width: fit-content;
        }
        .view-image-link-btn:hover {
          background: var(--accent-color, #c5a880);
          color: #ffffff;
        }

        /* ================= LIGHTBOX MODAL ================= */
        .image-lightbox-backdrop {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.25s ease-out;
        }

        .image-lightbox-container {
          display: flex;
          flex-direction: column;
          width: 95vw;
          max-width: 1400px;
          height: 92vh;
          background: #090e1a;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8);
          overflow: hidden;
        }

        .lightbox-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.85rem 1.5rem;
          background: rgba(15, 23, 42, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          gap: 1rem;
        }

        .lightbox-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }

        .lightbox-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .lightbox-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 0.45rem 0.85rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
        }
        .lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-1px);
        }
        .lightbox-btn.close-btn {
          background: #ef4444;
          border-color: #ef4444;
          padding: 0.45rem 0.7rem;
        }
        .lightbox-btn.close-btn:hover {
          background: #dc2626;
        }

        .lightbox-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #040711;
          padding: 1rem;
          position: relative;
        }

        .lightbox-body.scrollable {
          overflow: auto;
          display: block;
          text-align: center;
        }

        .lightbox-img {
          transition: transform 0.3s ease;
          border-radius: 8px;
          user-select: none;
        }

        .lightbox-img.fit-screen {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          cursor: zoom-in;
        }

        .lightbox-img.zoomed-in {
          width: auto;
          max-width: none;
          cursor: zoom-out;
          margin: 0 auto;
        }

        .lightbox-footer-tip {
          padding: 0.5rem 1rem;
          background: rgba(15, 23, 42, 0.9);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #94a3b8;
          font-size: 0.85rem;
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .image-lightbox-container {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
          }
          .lightbox-toolbar {
            padding: 0.6rem 1rem;
          }
          .lightbox-title {
            font-size: 0.95rem;
            max-width: 45%;
          }
          .lightbox-btn span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default News;
