import React, { useEffect, useState } from 'react';
import { Image, Video, Calendar, Tag, X, ZoomIn, Film } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [lightboxItem, setLightboxItem] = useState(null);

  // Extracted lists for filter dropdowns
  const [categories, setCategories] = useState([]);
  const [years, setYears] = useState([]);

  const fetchGallery = () => {
    setLoading(true);
    let url = '/api/gallery';
    let params = [];
    if (selectedCategory) params.push(`category=${selectedCategory}`);
    if (selectedYear) params.push(`year=${selectedYear}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setItems(data.data);

          // Populate filter options dynamically if they haven't been populated
          if (categories.length === 0) {
            const uniqueCats = [...new Set(data.data.map(item => item.category))];
            setCategories(uniqueCats);
          }
          if (years.length === 0) {
            const uniqueYears = [...new Set(data.data.map(item => item.year))].sort((a,b) => b-a);
            setYears(uniqueYears);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory, selectedYear]);

  const cleanYoutubeUrl = (url) => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="gallery-page container">
      <h1 className="section-title">معرض الصور والفيديو</h1>
      
      <p className="page-intro">
        استعرض ألبوم الصور والفيديوهات للأنشطة المختلفة، والمخيمات الصيفية والخدمات الاجتماعية والروحية في الكنيسة مرتبة حسب السنوات.
      </p>

      {/* Filter Bar */}
      <div className="filter-wrapper glass-card">
        <div className="filters-grid">
          {/* Category Filter */}
          <div className="filter-item">
            <label>النشاط أو المناسبة</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
            >
              <option value="">كل النشاطات</option>
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div className="filter-item">
            <label>السنة</label>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-control"
            >
              <option value="">كل السنوات</option>
              {years.map((year, idx) => (
                <option value={year} key={idx}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : items.length === 0 ? (
        <p className="no-data">لم نعثر على أي صور أو فيديوهات مطابقة للتصفية الحالية.</p>
      ) : (
        <div className="gallery-grid">
          {items.map((item) => (
            <div 
              className="gallery-item-card glass-card" 
              key={item._id}
              onClick={() => setLightboxItem(item)}
            >
              <div className="gallery-media-preview">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title} className="gallery-img" />
                ) : (
                  <div className="video-thumb-placeholder">
                    <Film size={40} className="film-icon" />
                    <span>تشغيل الفيديو</span>
                  </div>
                )}
                <div className="gallery-hover-overlay">
                  <ZoomIn size={28} />
                </div>
              </div>
              
              <div className="gallery-card-info">
                <h3>{item.title}</h3>
                <div className="gallery-card-meta">
                  <span className="info-tag"><Tag size={12} /> {item.category}</span>
                  <span className="info-tag"><Calendar size={12} /> {item.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div className="lightbox-overlay" onClick={() => setLightboxItem(null)}>
          <button className="lightbox-close" onClick={() => setLightboxItem(null)}>
            <X size={32} />
          </button>
          
          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            {lightboxItem.type === 'image' ? (
              <img src={lightboxItem.url} alt={lightboxItem.title} className="lightbox-full-img" />
            ) : (
              <div className="lightbox-video-wrapper">
                <iframe
                  width="100%"
                  height="450"
                  src={cleanYoutubeUrl(lightboxItem.url)}
                  title={lightboxItem.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  style={{ borderRadius: 'var(--radius-md)' }}
                ></iframe>
              </div>
            )}
            
            <div className="lightbox-caption">
              <h3>{lightboxItem.title}</h3>
              <p>{lightboxItem.category} • {lightboxItem.year}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-page {
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
        .filter-wrapper {
          padding: 1.25rem;
        }
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 576px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        .filter-item {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .filter-item label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        .gallery-item-card {
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }
        .gallery-media-preview {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
          background-color: var(--border-color);
        }
        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition);
        }
        .video-thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-dark), #1e293b);
          color: white;
          gap: 0.75rem;
        }
        .film-icon {
          color: var(--accent-color);
        }
        .gallery-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(26, 54, 93, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: var(--transition);
        }
        .gallery-item-card:hover .gallery-hover-overlay {
          opacity: 1;
        }
        .gallery-item-card:hover .gallery-img {
          transform: scale(1.05);
        }
        
        .gallery-card-info {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .gallery-card-info h3 {
          font-size: 1.1rem;
          margin: 0;
        }
        .gallery-card-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: var(--text-light);
        }
        .info-tag {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        /* Lightbox modal styles */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.95);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .lightbox-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: var(--transition);
        }
        .lightbox-close:hover {
          color: var(--accent-color);
        }
        .lightbox-content-box {
          max-width: 800px;
          width: 100%;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
        }
        .lightbox-full-img {
          width: 100%;
          max-height: 500px;
          object-fit: contain;
          background-color: #000;
        }
        .lightbox-video-wrapper {
          background-color: #000;
        }
        .lightbox-caption {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .lightbox-caption h3 {
          margin-bottom: 0.25rem;
        }
        .lightbox-caption p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
