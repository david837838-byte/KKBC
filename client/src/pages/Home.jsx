import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Calendar, BookOpen, ChevronLeft, Volume2, Video, FileText, HeartHandshake } from 'lucide-react';
import io from 'socket.io-client';

const Home = () => {
  const [settings, setSettings] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [latestSermons, setLatestSermons] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [countdownText, setCountdownText] = useState('');
  const [dailyVerse, setDailyVerse] = useState(null);

  useEffect(() => {
    // 1. Fetch website settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setSettings(data.data);
      })
      .catch(err => console.error(err));

    // 2. Fetch livestream status
    fetch('/api/livestream')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setIsLive(data.data.isLive);
      })
      .catch(err => console.error(err));

    // 3. Fetch latest 3 sermons
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setLatestSermons(data.data.slice(0, 3));
      })
      .catch(err => console.error(err));

    // 4. Fetch latest 3 news/events
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setLatestNews(data.data.slice(0, 3));
      })
      .catch(err => console.error(err));

    // 5. Fetch meetings for scheduling and countdown
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setMeetings(data.data);
          calculateCountdown(data.data);
        }
      })
      .catch(err => console.error(err));

    // 6. Fetch today's verse
    fetch('/api/daily-verses/today')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setDailyVerse(data.data);
      })
      .catch(err => console.error(err));

    // Socket.io for live updates
    const socket = io('/', { path: '/socket.io' });
    socket.on('liveStreamUpdate', (data) => {
      setIsLive(data.isLive);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Simplified Countdown to Sunday meeting (or next meeting)
  const calculateCountdown = (meetingsList) => {
    if (!meetingsList || meetingsList.length === 0) {
      setCountdownText('الأحد القادم الساعة 10:00 صباحاً');
      return;
    }
    
    // Default to the first meeting (usually Sunday Service)
    const primaryMeeting = meetingsList[0];
    setCountdownText(`اجتماعنا القادم: يوم ${primaryMeeting.day} الساعة ${primaryMeeting.time}`);
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={16} />;
      case 'audio': return <Volume2 size={16} />;
      case 'pdf': return <FileText size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-LB', options);
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-section" style={{
        backgroundImage: settings?.heroImageUrl 
          ? `linear-gradient(rgba(15, 35, 67, 0.85), rgba(15, 35, 67, 0.85)), url(${settings.heroImageUrl})`
          : 'linear-gradient(rgba(15, 35, 67, 0.85), rgba(15, 35, 67, 0.85)), url("/church_building.jpg")'
      }}>
        <div className="container hero-content">
          <span className="welcome-tag">أهلاً وسهلاً بكم في كنيستنا</span>
          <h1>{settings?.churchName || 'الكنيسة المعمدانية الإنجيلية – خربة قنافار'}</h1>
          <p className="welcome-message">
            {settings?.welcomeMessage || 'نحن جماعة من المؤمنين بالمسيح نسعى لعيش الإيمان بفاعلية ونشر الكلمة وتلمذة النفوس.'}
          </p>

          <div className="hero-cta-group">
            {isLive ? (
              <Link to="/live" className="btn btn-accent pulse-btn">
                <Radio size={20} className="blink" />
                <span>شاهد البث المباشر الآن!</span>
              </Link>
            ) : (
              <div className="countdown-container">
                <span className="countdown-label">البث غير نشط حالياً</span>
                <span className="countdown-timer">{countdownText}</span>
              </div>
            )}
            
            <Link to="/about" className="btn btn-outline" style={{ border: '2px solid white', color: 'white' }}>
              تعرف علينا
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Verse Section */}
      <section className="verse-section container">
        <div className="verse-card" style={{ position: 'relative' }}>
          <BookOpen className="verse-icon" size={32} />
          <blockquote className="verse-text">
            {dailyVerse ? dailyVerse.text : (settings?.verseText || '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»')}
          </blockquote>
          <cite className="verse-ref">
            {dailyVerse ? dailyVerse.reference : (settings?.verseReference || 'يشوع 24: 15')}
          </cite>
          
          <button 
            onClick={() => {
              const currentVerse = dailyVerse ? dailyVerse.text : (settings?.verseText || '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»');
              const currentRef = dailyVerse ? dailyVerse.reference : (settings?.verseReference || 'يشوع 24: 15');
              navigator.clipboard.writeText(`"${currentVerse}" - ${currentRef}`);
              alert('تم نسخ آية اليوم بنجاح لمشاركتها! 📋');
            }}
            className="btn btn-outline" 
            style={{ 
              marginTop: '1rem', 
              padding: '0.4rem 0.85rem', 
              fontSize: '0.8rem', 
              borderColor: 'var(--accent-color)', 
              color: 'var(--accent-color)',
              fontWeight: 'bold',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            📋 نسخ ومشاركة آية اليوم
          </button>
        </div>
      </section>

      {/* Dynamic Content Grid: Latest Sermons & News */}
      <section className="content-section container">
        <div className="grid-2">
          {/* Latest Sermons */}
          <div className="home-column">
            <div className="column-header">
              <h2>آخر العظات والرسائل</h2>
              <Link to="/sermons" className="view-all-link">
                <span>كل العظات</span>
                <ChevronLeft size={16} />
              </Link>
            </div>
            
            <div className="list-cards">
              {latestSermons.length === 0 ? (
                <p className="no-data">لا توجد عظات متوفرة حالياً</p>
              ) : (
                latestSermons.map(sermon => (
                  <div className="item-card glass-card" key={sermon._id}>
                    <div className="card-media-type">
                      {getMediaIcon(sermon.type)}
                      <span className="category-badge">{sermon.category}</span>
                    </div>
                    <h3>{sermon.title}</h3>
                    <div className="card-meta">
                      <span>الواعظ: {sermon.preacher}</span>
                      <span>•</span>
                      <span>{formatDate(sermon.date)}</span>
                    </div>
                    {sermon.description && <p className="card-desc">{sermon.description.substring(0, 100)}...</p>}
                    <Link to="/sermons" className="card-action-btn">استمع / شاهد</Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Latest News */}
          <div className="home-column">
            <div className="column-header">
              <h2>الأخبار والإعلانات</h2>
              <Link to="/news" className="view-all-link">
                <span>كل الأخبار</span>
                <ChevronLeft size={16} />
              </Link>
            </div>
            
            <div className="list-cards">
              {latestNews.length === 0 ? (
                <p className="no-data">لا توجد أخبار أو إعلانات متوفرة حالياً</p>
              ) : (
                latestNews.map(newsItem => (
                  <div className="item-card glass-card" key={newsItem._id}>
                    <span className={`news-tag ${newsItem.category}`}>
                      {newsItem.category === 'event' ? 'فعالية' : newsItem.category === 'announcement' ? 'إعلان' : 'خبر'}
                    </span>
                    <h3>{newsItem.title}</h3>
                    {newsItem.content && <p className="card-desc">{newsItem.content.substring(0, 110)}...</p>}
                    <div className="card-meta">
                      <span>{formatDate(newsItem.date)}</span>
                    </div>
                    <Link to="/news" className="card-action-btn">اقرأ المزيد</Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Preview Banner */}
      <section className="schedule-preview-section">
        <div className="container preview-wrapper">
          <div className="preview-info">
            <h2>شاركنا العبادة والشركة</h2>
            <p>ندعو عائلتك للانضمام إلينا في اجتماعاتنا الروحية لمختلف الفئات العمرية.</p>
            <Link to="/meetings" className="btn btn-accent">
              <Calendar size={18} />
              <span>جدول الاجتماعات الكامل</span>
            </Link>
          </div>
          <div className="preview-grid">
            {meetings.slice(0, 2).map((meeting) => (
              <div className="preview-card" key={meeting._id}>
                <h4>{meeting.title}</h4>
                <div className="time-badge">{meeting.day} • {meeting.time}</div>
                <p>{meeting.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action: Prayer request */}
      <section className="cta-prayer-section container">
        <div className="prayer-cta-card glass-card">
          <HeartHandshake size={48} className="cta-icon" />
          <div className="cta-text">
            <h3>هل تحتاج إلى صلاة؟</h3>
            <p>نحن هنا لنرفع صلواتنا معك ولأجلك. لا تتردد في مشاركتنا طلباتك، وسوف يرفعها فريق الصلاة بكل أمانة وسرية.</p>
          </div>
          <Link to="/prayer" className="btn btn-primary">
            أرسل طلبة صلاة
          </Link>
        </div>
      </section>

      {/* Smart Phone PWA Application Section */}
      <section className="pwa-app-section container">
        <div className="app-card glass-card">
          <div className="app-content-wrapper">
            <div className="app-text-column">
              <span className="app-tag">تطبيق الهواتف الذكية</span>
              <h2>ثبّت تطبيق كنيسة خربة قنافار على هاتفك 📱</h2>
              <p className="app-desc">
                استمتع بمتابعة البث المباشر، قراءة الكتاب المقدس، الاستماع للترانيم وتصفح الدراسات الروحية مباشرة من شاشتك الرئيسية دون الحاجة لمتجر التطبيقات!
              </p>
              
              <div className="pwa-features">
                <div className="pwa-feature-item">
                  <span className="pwa-feature-badge">⚡</span>
                  <div>
                    <h4>تنبيهات فورية</h4>
                    <p>احصل على إشعارات فورية عند بدء البث المباشر أو نشر عظات جديدة.</p>
                  </div>
                </div>
                <div className="pwa-feature-item">
                  <span className="pwa-feature-badge">📶</span>
                  <div>
                    <h4>يعمل دون إنترنت</h4>
                    <p>تصفح الترانيم والكتاب المقدس حتى عند انقطاع الاتصال بالشبكة.</p>
                  </div>
                </div>
              </div>

              <div className="installation-steps">
                <div className="step-col">
                  <h4>🤖 هواتف الأندرويد (Chrome):</h4>
                  <ol>
                    <li>انقر على زر القائمة (3 نقاط) أعلى المتصفح.</li>
                    <li>اختر <strong>«تثبيت التطبيق»</strong> أو <strong>«إضافة للشاشة الرئيسية»</strong>.</li>
                  </ol>
                </div>
                <div className="step-col">
                  <h4>🍏 هواتف الآيفون (Safari):</h4>
                  <ol>
                    <li>انقر على زر <strong>«مشاركة» (Share)</strong> أسفل المتصفح.</li>
                    <li>اختر <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="app-visual-column">
              <div className="smartphone-mockup">
                <div className="mockup-screen" style={{ backgroundImage: `url(${settings?.logoImageUrl || '/uploads/settings/logo-placeholder.png'})` }}>
                  <div className="mockup-app-header">كنيسة خربة قنافار</div>
                  <div className="mockup-app-content">
                    <span className="mockup-badge">مباشر الآن 🔴</span>
                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>انضم إلينا في عبادة روحية مباركة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          background-size: cover;
          background-position: center;
          color: white;
          padding: 8rem 0;
          text-align: center;
        }
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .welcome-tag {
          color: var(--accent-color);
          font-weight: 700;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .hero-content h1 {
          font-size: 3rem;
          color: white;
          font-weight: 800;
        }
        .welcome-message {
          font-size: 1.2rem;
          color: #e2e8f0;
          line-height: 1.7;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .pulse-btn {
          animation: pulse 2s infinite;
        }
        .countdown-container {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.6rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 250px;
        }
        .countdown-label {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .countdown-timer {
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--accent-color);
        }

        .verse-section {
          margin-top: -3rem;
          position: relative;
          z-index: 10;
        }
        .verse-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          border-radius: var(--radius-lg);
          padding: 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          border-top: 4px solid var(--accent-color);
        }
        .verse-icon {
          color: var(--accent-color);
        }
        .verse-text {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--primary-color);
          font-style: italic;
          line-height: 1.5;
        }
        [data-theme="dark"] .verse-text {
          color: var(--accent-color);
        }
        .verse-ref {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .content-section {
          padding: 4rem 0;
        }
        .home-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.75rem;
        }
        .view-all-link {
          display: flex;
          align-items: center;
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .view-all-link:hover {
          color: var(--primary-color);
        }
        .list-cards {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .item-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.5rem;
        }
        .card-media-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-color);
          font-size: 0.85rem;
        }
        .category-badge {
          background: rgba(197, 168, 128, 0.15);
          color: var(--accent-color);
          padding: 0.1rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 700;
        }
        .news-tag {
          font-size: 0.75rem;
          font-weight: 700;
          align-self: flex-start;
          padding: 0.15rem 0.6rem;
          border-radius: 9999px;
        }
        .news-tag.event { background: #dcfce7; color: #166534; }
        .news-tag.announcement { background: #fef3c7; color: #92400e; }
        .news-tag.news { background: #dbeafe; color: #1e40af; }
        .card-meta {
          font-size: 0.85rem;
          color: var(--text-light);
          display: flex;
          gap: 0.5rem;
        }
        .card-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .card-action-btn {
          margin-top: 0.5rem;
          align-self: flex-start;
          font-weight: 700;
          color: var(--primary-color);
          font-size: 0.9rem;
        }
        [data-theme="dark"] .card-action-btn {
          color: var(--accent-color);
        }

        .schedule-preview-section {
          background-color: var(--primary-color);
          color: white;
          padding: 5rem 0;
          margin: 4rem 0;
        }
        .preview-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 992px) {
          .preview-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .preview-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .preview-info h2 {
          color: var(--accent-color);
          font-size: 2.25rem;
        }
        .preview-info p {
          color: #cbd5e1;
          font-size: 1.1rem;
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 576px) {
          .preview-grid {
            grid-template-columns: 1fr;
          }
        }
        .preview-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .preview-card h4 {
          color: white;
        }
        .time-badge {
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .preview-card p {
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .cta-prayer-section {
          padding-bottom: 4rem;
        }
        .prayer-cta-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 3rem;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .cta-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        .cta-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .cta-text h3 {
          font-size: 1.6rem;
        }
        .cta-text p {
          color: var(--text-secondary);
          max-width: 600px;
        }
        @media (max-width: 768px) {
          .prayer-cta-card {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }
          .cta-text p {
            max-width: 100%;
          }
          .prayer-cta-card .btn {
            width: 100%;
          }
        }

        /* PWA App Section Styles */
        .pwa-app-section {
          padding-bottom: 4rem;
        }
        .app-card {
          padding: 3.5rem;
          border: 1px solid var(--border-color);
        }
        .app-content-wrapper {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 992px) {
          .app-content-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .app-tag {
          color: var(--accent-color);
          font-weight: 700;
          font-size: 0.9rem;
          text-transform: uppercase;
        }
        .app-text-column h2 {
          font-size: 2.2rem;
          margin-top: 0.5rem;
          color: var(--primary-color);
          line-height: 1.3;
        }
        [data-theme="dark"] .app-text-column h2 {
          color: white;
        }
        .app-desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-top: 1rem;
          line-height: 1.6;
        }
        .pwa-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 1.5rem 0;
        }
        .pwa-feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .pwa-feature-badge {
          background: rgba(197, 168, 128, 0.15);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .pwa-feature-item h4 {
          font-size: 1rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .pwa-feature-item h4 {
          color: white;
        }
        .pwa-feature-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .installation-steps {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          margin-top: 1.5rem;
        }
        @media (max-width: 576px) {
          .installation-steps {
            grid-template-columns: 1fr;
          }
        }
        .step-col h4 {
          color: var(--accent-color);
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .step-col ol {
          padding-right: 1.2rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        /* Smartphone Mockup */
        .app-visual-column {
          display: flex;
          justify-content: center;
        }
        .smartphone-mockup {
          width: 250px;
          height: 500px;
          border: 12px solid #1e293b;
          border-radius: 36px;
          background: #0f172a;
          position: relative;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .smartphone-mockup::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 20px;
          background: #1e293b;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          z-index: 10;
        }
        .mockup-screen {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 1.2rem 1.5rem 1.2rem;
          color: white;
          position: relative;
        }
        .mockup-screen::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(15, 35, 67, 0.4), rgba(15, 35, 67, 0.9));
          z-index: 1;
        }
        .mockup-app-header {
          position: relative;
          z-index: 2;
          font-weight: 800;
          font-size: 1.2rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          text-align: center;
        }
        .mockup-app-content {
          position: relative;
          z-index: 2;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          padding: 1rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .mockup-badge {
          background: #ef4444;
          padding: 0.15rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-block;
          margin-bottom: 0.35rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
