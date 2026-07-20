import React, { useEffect, useState } from 'react';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { t, language, translateText } = useLanguage();

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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-LB' : 'en-US', options);
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
          {news.map((item) => (
            <article className="news-card glass-card" key={item._id}>
              {item.imageUrl && (
                <div className="news-image-wrapper">
                  <img src={item.imageUrl} alt={item.title} className="news-card-image" />
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

                <h3>{translateText(item.title, item.titleEn)}</h3>
                
                <p className="news-excerpt">
                  {translateText(item.content, item.contentEn)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      <style>{`
        .news-page {
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
        }
        .news-image-wrapper {
          width: 100%;
          height: 200px;
          overflow: hidden;
          background-color: #cbd5e1;
        }
        .news-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        .news-card:hover .news-card-image {
          transform: scale(1.05);
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
        }
        .news-excerpt {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
};

export default News;
