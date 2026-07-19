import React, { useEffect, useState } from 'react';
import { Search, Calendar, User, Volume2, Video, FileText, Download, Play, Pause, ExternalLink } from 'lucide-react';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPreacher, setSelectedPreacher] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Dropdown lists
  const [preachers, setPreachers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch sermons
  const fetchSermons = () => {
    setLoading(true);
    let url = `/api/sermons?search=${search}`;
    if (selectedPreacher) url += `&preacher=${selectedPreacher}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;
    if (selectedType) url += `&type=${selectedType}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSermons(data.data);
          
          // Dynamically extract preachers and categories for filter dropdowns if not set yet
          if (preachers.length === 0) {
            const uniquePreachers = [...new Set(data.data.map(item => item.preacher))];
            setPreachers(uniquePreachers);
          }
          if (categories.length === 0) {
            const uniqueCategories = [...new Set(data.data.map(item => item.category))];
            setCategories(uniqueCategories);
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
    fetchSermons();
  }, [selectedPreacher, selectedCategory, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSermons();
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="media-icon-indicator text-red" />;
      case 'audio': return <Volume2 className="media-icon-indicator text-blue" />;
      case 'pdf': return <FileText className="media-icon-indicator text-green" />;
      default: return <ExternalLink className="media-icon-indicator" />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-LB', options);
  };

  const cleanYoutubeUrl = (url) => {
    if (!url) return '';
    // Convert watch link to embed link
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  return (
    <div className="sermons-page container">
      <h1 className="section-title">العظات والتعليم الروحي</h1>
      
      <p className="page-intro">
        استمع وشاهد مكتبة العظات والرسائل الروحية المسجلة لمجموعة من الرعاة والخدام. يمكنك البحث والتصفية حسب نوع العظة والواعظ والتصنيف الدراسي.
      </p>

      {/* Filter and Search Bar */}
      <div className="filter-wrapper glass-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-group">
            <input 
              type="text" 
              placeholder="ابحث عن عنوان العظة أو الواعظ..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary search-btn">
              <Search size={18} />
              <span>بحث</span>
            </button>
          </div>
        </form>

        <div className="filters-grid">
          {/* Preacher Filter */}
          <div className="filter-item">
            <label>الواعظ</label>
            <select 
              value={selectedPreacher} 
              onChange={(e) => setSelectedPreacher(e.target.value)}
              className="form-control"
            >
              <option value="">كل الخدام</option>
              {preachers.map((preacher, idx) => (
                <option value={preacher} key={idx}>{preacher}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-item">
            <label>التصنيف الروحي</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-control"
            >
              <option value="">كل التصنيفات</option>
              {categories.map((cat, idx) => (
                <option value={cat} key={idx}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Media Type Filter */}
          <div className="filter-item">
            <label>الوسائط</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-control"
            >
              <option value="">كل أنواع الوسائط</option>
              <option value="video">فيديو</option>
              <option value="audio">ملف صوتي</option>
              <option value="pdf">ملف PDF / نص</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sermons Grid */}
      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : sermons.length === 0 ? (
        <p className="no-data">لم نعثر على أي عظات مطابقة لبحثك.</p>
      ) : (
        <div className="grid-2 sermons-grid">
          {sermons.map((sermon) => (
            <div className="sermon-card-detailed glass-card" key={sermon._id}>
              <div className="card-top">
                <span className="sermon-category">{sermon.category}</span>
                {getMediaIcon(sermon.type)}
              </div>

              <h3>{sermon.title}</h3>

              <div className="sermon-meta">
                <div className="meta-item">
                  <User size={16} />
                  <span>الواعظ: {sermon.preacher}</span>
                </div>
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>تاريخ النشر: {formatDate(sermon.date)}</span>
                </div>
              </div>

              {sermon.description && (
                <p className="sermon-desc">{sermon.description}</p>
              )}

              {/* Media rendering logic */}
              <div className="media-player-container">
                {sermon.type === 'video' && sermon.url && (
                  <div className="video-responsive">
                    <iframe
                      width="100%"
                      height="200"
                      src={cleanYoutubeUrl(sermon.url)}
                      title={sermon.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ borderRadius: 'var(--radius-md)' }}
                    ></iframe>
                  </div>
                )}

                {sermon.type === 'audio' && (sermon.fileUrl || sermon.url) && (
                  <div className="audio-player-wrapper">
                    <audio 
                      src={sermon.fileUrl || sermon.url} 
                      controls 
                      className="custom-audio-tag"
                      style={{ width: '100%', marginTop: '0.5rem' }}
                    ></audio>
                  </div>
                )}

                {sermon.type === 'pdf' && sermon.fileUrl && (
                  <a 
                    href={sermon.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline pdf-download-btn"
                  >
                    <Download size={16} />
                    <span>تنزيل أو قراءة ملف PDF</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .sermons-page {
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
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .search-form {
          width: 100%;
        }
        .search-input-group {
          display: flex;
          gap: 0.75rem;
        }
        .search-input-group input {
          flex: 1;
        }
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .search-input-group {
            flex-direction: column;
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
        
        .sermons-grid {
          margin-top: 1rem;
        }
        .sermon-card-detailed {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-top: 4px solid var(--primary-color);
        }
        .sermon-card-detailed:hover {
          border-top-color: var(--accent-color);
        }
        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sermon-category {
          background-color: rgba(26, 54, 93, 0.08);
          color: var(--primary-color);
          font-weight: 800;
          font-size: 0.8rem;
          padding: 0.15rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        [data-theme="dark"] .sermon-category {
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--accent-color);
        }
        .media-icon-indicator {
          width: 24px;
          height: 24px;
          padding: 4px;
          border-radius: 50%;
          background-color: var(--border-color);
        }
        .media-icon-indicator.text-red { color: #ef4444; background-color: rgba(239, 68, 68, 0.1); }
        .media-icon-indicator.text-blue { color: #3b82f6; background-color: rgba(59, 130, 246, 0.1); }
        .media-icon-indicator.text-green { color: #10b981; background-color: rgba(16, 185, 129, 0.1); }

        .sermon-card-detailed h3 {
          font-size: 1.4rem;
        }
        .sermon-meta {
          display: flex;
          gap: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-light);
          flex-wrap: wrap;
        }
        .sermon-meta .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .sermon-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .media-player-container {
          margin-top: 0.5rem;
        }
        .video-responsive {
          overflow: hidden;
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
        }
        .pdf-download-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem;
        }
      `}</style>
    </div>
  );
};

export default Sermons;
