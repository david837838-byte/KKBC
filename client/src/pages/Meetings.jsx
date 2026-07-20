import React, { useEffect, useState } from 'react';
import { Clock, MapPin, Calendar, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch('/api/meetings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setMeetings(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="meetings-page container">
      <h1 className="section-title">{t('meetings.title')}</h1>
      
      <p className="page-intro">
        {t('meetings.subtitle')}
      </p>

      {loading ? (
        <div className="flex-center" style={{ minHeight: '200px' }}>
          <div className="loading-spinner"></div>
        </div>
      ) : meetings.length === 0 ? (
        <p className="no-data">{t('common.noData')}</p>
      ) : (
        <div className="grid-3 meetings-grid">
          {meetings.map((meeting) => (
            <div className="meeting-card glass-card" key={meeting._id}>
              <div className="day-badge">{meeting.day}</div>
              
              <h3>{meeting.title}</h3>
              
              <div className="meeting-meta">
                <div className="meta-item">
                  <Clock size={16} className="meta-icon" />
                  <span>{t('meetings.time')}: {meeting.time}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} className="meta-icon" />
                  <span>{t('meetings.location')}: {meeting.location || (language === 'ar' ? 'مبنى الكنيسة' : 'Church Building')}</span>
                </div>
              </div>

              {meeting.description && (
                <p className="meeting-desc">{meeting.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sidebar reminder / Invitation */}
      <section className="meetings-invite glass-card">
        <HeartHandshake size={36} className="invite-icon" />
        <div>
          <h3>{language === 'ar' ? 'هل تود الزيارة أو لديك استفسار؟' : 'Would You Like to Visit or Have a Question?'}</h3>
          <p>{t('contact.subtitle')}</p>
        </div>
        <Link to="/contact" className="btn btn-accent">
          {t('nav.contact')}
        </Link>
      </section>

      <style>{`
        .meetings-page {
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
        .meetings-grid {
          margin-top: 1rem;
        }
        .meeting-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 4px solid var(--primary-color);
          overflow: hidden;
        }
        .meeting-card:hover {
          border-top-color: var(--accent-color);
        }
        .day-badge {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background-color: var(--accent-color);
          color: var(--primary-dark);
          font-weight: 800;
          font-size: 0.85rem;
          padding: 0.2rem 0.75rem;
          border-radius: var(--radius-sm);
        }
        .meeting-card h3 {
          font-size: 1.25rem;
          margin-top: 1.5rem;
          padding-left: 4.5rem; /* space for absolute badge on left */
        }
        .meeting-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .meta-icon {
          color: var(--accent-color);
        }
        .meeting-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          border-right: 2px solid var(--border-color);
          padding-right: 0.5rem;
        }
        
        .meetings-invite {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2.5rem;
          gap: 2rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .invite-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }
        .meetings-invite h3 {
          margin-bottom: 0.5rem;
        }
        .meetings-invite p {
          color: var(--text-secondary);
          max-width: 650px;
        }
        @media (max-width: 768px) {
          .meetings-invite {
            flex-direction: column;
            text-align: center;
          }
          .meetings-invite .btn {
            width: 100%;
          }
        }
        
        /* Loading Spinner */
        .loading-spinner {
          border: 4px solid rgba(0,0,0,0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border-left-color: var(--accent-color);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Meetings;
