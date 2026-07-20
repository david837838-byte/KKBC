import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Clock, FileText, ChevronRight, User, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { t, language } = useLanguage();

  const categories = ['الكل', 'دراسات كتابية', 'تأملات روحية', 'الأسرة المسيحية', 'مقالات روحية'];

  const fetchArticles = () => {
    setLoading(true);
    let url = `/api/articles?search=${search}`;
    if (activeCategory !== 'الكل' && activeCategory !== 'All') {
      url += `&category=${activeCategory}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setArticles(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchArticles();
  }, [activeCategory, search]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-LB' : 'en-US', options);
  };

  return (
    <div className="articles-page container">
      {selectedArticle ? (
        // Detailed Article View
        <div className="article-detail-view animate-fade-in">
          <button className="back-btn" onClick={() => setSelectedArticle(null)}>
            <ChevronRight size={18} />
            <span>{t('common.back')}</span>
          </button>

          <article className="glass-card article-content-card">
            {selectedArticle.imageUrl && (
              <div className="article-hero-image" style={{ backgroundImage: `url(${selectedArticle.imageUrl})` }}></div>
            )}
            
            <div className="article-header">
              <span className="article-badge">{selectedArticle.category}</span>
              <h1>{selectedArticle.title}</h1>
              
              <div className="article-meta-info">
                <span className="meta-item">
                  <User size={16} />
                  <span>{selectedArticle.author}</span>
                </span>
                <span className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(selectedArticle.createdAt)}</span>
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  <span>{selectedArticle.readTime} دقائق للقراءة</span>
                </span>
              </div>
            </div>

            <hr className="divider" />

            <div className="article-body-text">
              {selectedArticle.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {selectedArticle.pdfUrl && (
              <div className="article-attachments">
                <h3>مرفقات الدراسة الروحية</h3>
                <a 
                  href={selectedArticle.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-accent attachment-btn"
                >
                  <FileText size={18} />
                  <span>تحميل الدراسة كاملة (PDF)</span>
                </a>
              </div>
            )}
          </article>
        </div>
      ) : (
        // Main Articles List
        <>
          <h1 className="section-title">المقالات والدراسات الروحية</h1>
          <p className="page-intro">
            تصفح أحدث الدراسات الروحية، التفسيرات الكتابية والرسائل الرعوية المقدمة لعائلة الكنيسة للنمو الروحي والمعرفة العميقة بكلمة الله.
          </p>

          {/* Search and Filters */}
          <div className="articles-toolbar">
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="ابحث في العناوين والمحتوى..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="categories-filter-wrapper">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state glass-card">
              <BookOpen size={48} className="empty-icon" />
              <h3>لا يوجد مقالات حالياً</h3>
              <p>لم يتم العثور على أي مقالات تطابق خيارات البحث الخاصة بك. يرجى المحاولة بكلمات بحث أخرى.</p>
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((art) => (
                <div key={art._id} className="article-card glass-card hover-card" onClick={() => setSelectedArticle(art)}>
                  {art.imageUrl && (
                    <div className="card-image" style={{ backgroundImage: `url(${art.imageUrl})` }}></div>
                  )}
                  <div className="card-content">
                    <div className="card-top-meta">
                      <span className="card-category-badge">{art.category}</span>
                      <span className="card-read-time">
                        <Clock size={12} />
                        <span>{art.readTime} د قراءة</span>
                      </span>
                    </div>
                    
                    <h3 className="card-title">{art.title}</h3>
                    <p className="card-snippet">{art.content.substring(0, 140)}...</p>
                    
                    <div className="card-footer">
                      <div className="author-info">
                        <User size={14} />
                        <span>{art.author}</span>
                      </div>
                      <span className="read-more-text">اقرأ المقال</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .articles-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          min-height: 80vh;
        }
        .articles-toolbar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        .search-bar-wrapper {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        .search-icon {
          position: absolute;
          right: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        .search-input {
          width: 100%;
          padding: 0.9rem 3rem 0.9rem 1.2rem;
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          background: var(--bg-secondary);
          color: var(--text-main);
          font-size: 0.95rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .search-input:focus {
          border-color: var(--accent-color);
          box-shadow: 0 0 0 3px rgba(197, 168, 128, 0.15);
        }
        .categories-filter-wrapper {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          scrollbar-width: thin;
        }
        .filter-btn {
          white-space: nowrap;
          padding: 0.5rem 1.2rem;
          border: 1px solid var(--border-color);
          border-radius: 9999px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .filter-btn:hover {
          border-color: var(--accent-color);
          color: var(--accent-color);
        }
        .filter-btn.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
        [data-theme="dark"] .filter-btn.active {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: var(--primary-color);
        }

        /* Articles Grid */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }
        .article-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid var(--border-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-image {
          height: 180px;
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--border-color);
        }
        .card-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex: 1;
        }
        .card-top-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-category-badge {
          background: rgba(197, 168, 128, 0.12);
          color: var(--accent-color);
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .card-read-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .card-title {
          font-size: 1.15rem;
          color: var(--primary-color);
          line-height: 1.4;
        }
        [data-theme="dark"] .card-title {
          color: white;
        }
        .card-snippet {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex: 1;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 0.8rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
        }
        .author-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-light);
        }
        .read-more-text {
          color: var(--accent-color);
          font-weight: 700;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .empty-icon {
          color: var(--text-light);
        }
        .empty-state p {
          color: var(--text-secondary);
          max-width: 450px;
        }

        /* Article Detail View */
        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          margin-bottom: 1.5rem;
          outline: none;
          align-self: flex-start;
        }
        .back-btn:hover {
          color: var(--primary-color);
        }
        .article-content-card {
          padding: 0;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .article-hero-image {
          height: 350px;
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--border-color);
        }
        .article-header {
          padding: 2.5rem 2.5rem 1rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .article-badge {
          background: rgba(197, 168, 128, 0.15);
          color: var(--accent-color);
          padding: 0.2rem 0.8rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
        }
        .article-header h1 {
          font-size: 2.2rem;
          color: var(--primary-color);
          line-height: 1.3;
        }
        [data-theme="dark"] .article-header h1 {
          color: white;
        }
        .article-meta-info {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          font-size: 0.85rem;
          color: var(--text-light);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .divider {
          margin: 0 2.5rem;
          border: 0;
          border-top: 1px solid var(--border-color);
        }
        .article-body-text {
          padding: 2rem 2.5rem;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: justify;
        }
        .article-attachments {
          background: rgba(197, 168, 128, 0.05);
          border-top: 1px solid var(--border-color);
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: flex-start;
        }
        .article-attachments h3 {
          font-size: 1.15rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .article-attachments h3 {
          color: white;
        }
        .attachment-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .article-hero-image {
            height: 200px;
          }
          .article-header {
            padding: 1.5rem 1.5rem 0.8rem 1.5rem;
          }
          .article-header h1 {
            font-size: 1.6rem;
          }
          .divider {
            margin: 0 1.5rem;
          }
          .article-body-text {
            padding: 1.5rem;
            font-size: 1rem;
          }
          .article-attachments {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Articles;
