import React, { useEffect, useState } from 'react';
import { Radio, Calendar, Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const LiveStream = () => {
  const [streamInfo, setStreamInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdownText, setCountdownText] = useState('البث القادم: يوم الأحد الساعة 10:00 صباحاً');

  useEffect(() => {
    // Fetch live stream status
    const fetchStream = () => {
      fetch('/api/livestream')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setStreamInfo(data.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchStream();

    // Fetch next meeting time to display as countdown placeholder
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && data.data.length > 0) {
          const mainMeeting = data.data[0];
          setCountdownText(`البث المباشر القادم: يوم ${mainMeeting.day} الساعة ${mainMeeting.time}`);
        }
      })
      .catch(err => console.error(err));

    // Connect to Socket.io for live updates
    const socket = io('/', { path: '/socket.io' });
    socket.on('liveStreamUpdate', (data) => {
      setStreamInfo(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const cleanYoutubeUrl = (url) => {
    if (!url) return '';
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="livestream-page container">
      <h1 className="section-title">البث المباشر</h1>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '300px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : streamInfo?.isLive ? (
        <div className="active-live-container glass-card">
          <div className="live-header">
            <div className="live-badge">
              <Radio size={16} className="blink" />
              <span>بث مباشر الآن</span>
            </div>
            <h2>{streamInfo.title || 'اجتماع العبادة والشركة الروحية'}</h2>
          </div>

          <p className="live-desc">{streamInfo.description || 'يسعدنا انضمامكم إلينا للمشاركة في العبادة وسماع كلمة الله.'}</p>

          {/* Embed player based on platform */}
          <div className="player-wrapper">
            {streamInfo.platform === 'youtube' && streamInfo.url ? (
              <div className="iframe-container">
                <iframe
                  width="100%"
                  height="500"
                  src={cleanYoutubeUrl(streamInfo.url)}
                  title="YouTube Live Stream"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ borderRadius: 'var(--radius-lg)' }}
                ></iframe>
              </div>
            ) : (
              <div className="fallback-platform-link">
                <p>البث المباشر نشط حالياً على منصة <strong>{streamInfo.platform === 'facebook' ? 'فيسبوك' : 'أخرى'}</strong>.</p>
                <a 
                  href={streamInfo.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                >
                  <ExternalLink size={18} />
                  <span>انتقل لمشاهدة البث على {streamInfo.platform === 'facebook' ? 'فيسبوك' : 'الرابط المباشر'}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="offline-live-container glass-card">
          <div className="offline-icon-wrapper">
            <Radio size={48} className="offline-icon" />
          </div>
          <h2>البث المباشر غير متاح حالياً</h2>
          <p className="offline-message">نشكر محبتكم لمتابعتنا. في الوقت الحالي لا يوجد اجتماع منقول مباشرة على الموقع.</p>
          
          <div className="next-event-countdown">
            <span className="countdown-title">موعد الاجتماع القادم</span>
            <span className="countdown-datetime">{countdownText}</span>
          </div>

          <div className="offline-actions">
            <Link to="/meetings" className="btn btn-primary">
              <Calendar size={18} />
              <span>عرض جدول الاجتماعات الأسبوعية</span>
            </Link>
            <Link to="/sermons" className="btn btn-outline">
              <Play size={18} />
              <span>استمع للعظات المسجلة</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .livestream-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .active-live-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-top: 5px solid var(--error-color);
        }
        .live-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .live-header h2 {
          font-size: 1.6rem;
          margin: 0;
        }
        .live-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
        }
        .player-wrapper {
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background-color: #000000;
          box-shadow: var(--shadow-lg);
        }
        .iframe-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
        }
        .iframe-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .fallback-platform-link {
          padding: 4rem;
          text-align: center;
          color: white;
        }
        .fallback-platform-link p {
          font-size: 1.2rem;
          color: #cbd5e1;
        }

        .offline-live-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          gap: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
          border-top: 4px solid var(--text-light);
        }
        .offline-icon-wrapper {
          width: 90px;
          height: 90px;
          background-color: var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .offline-icon {
          color: var(--text-light);
        }
        .offline-message {
          font-size: 1.1rem;
          color: var(--text-secondary);
          max-width: 500px;
        }
        .next-event-countdown {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 300px;
        }
        .countdown-title {
          font-size: 0.8rem;
          color: var(--text-light);
          font-weight: 700;
        }
        .countdown-datetime {
          font-size: 1.05rem;
          color: var(--accent-color);
          font-weight: 800;
        }
        .offline-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1rem;
        }
        @media (max-width: 576px) {
          .offline-actions {
            flex-direction: column;
            width: 100%;
          }
          .offline-actions .btn {
            width: 100%;
          }
          .next-event-countdown {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveStream;
