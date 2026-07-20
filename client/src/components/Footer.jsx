import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error('Error fetching settings for footer:', err));
  }, []);

  const churchName = settings?.churchName || t('common.fullChurchTitle');
  const email = settings?.contactEmail || 'info@churchqanafar.org';
  const phones = settings?.contactPhones || ['+961 70 123 456'];
  const address = settings?.address || t('contact.addressValue');
  
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/96170123456';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        {/* About Section */}
        <div className="footer-about">
          <h3>{churchName}</h3>
          <p>
            {settings?.welcomeMessage || t('footer.description')}
          </p>
          <div className="social-links">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-icon fb" title="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="social-icon yt" title="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-icon wa" title="WhatsApp">
              <MessageCircle size={18} />
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon ig" title="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="social-icon tt" title="TikTok">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><Link to="/">{t('nav.home')}</Link></li>
            <li><Link to="/about">{t('nav.about')}</Link></li>
            <li><Link to="/meetings">{t('nav.meetings')}</Link></li>
            <li><Link to="/sermons">{t('nav.sermons')}</Link></li>
            <li><Link to="/hymns">{t('nav.hymns')}</Link></li>
            <li><Link to="/news">{t('nav.news')}</Link></li>
            <li><Link to="/gallery">{t('nav.gallery')}</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h4>{t('contact.getInTouch')}</h4>
          <div className="contact-item">
            <MapPin size={18} className="contact-icon" />
            <span>{address}</span>
          </div>
          {phones.map((phone, idx) => (
            <div className="contact-item" key={idx}>
              <Phone size={18} className="contact-icon" />
              <span dir="ltr">{phone}</span>
            </div>
          ))}
          <div className="contact-item">
            <Mail size={18} className="contact-icon" />
            <span>{email}</span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <p>© {new Date().getFullYear()} {churchName}. {t('footer.allRightsReserved')}</p>
          {settings?.visitorCount !== undefined && (
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>
              {language === 'ar' ? `عدد زيارات الموقع: ${settings.visitorCount}` : `Site Visits: ${settings.visitorCount}`}
            </span>
          )}
          <Link to="/login" className="admin-portal-link">
            <ShieldAlert size={14} />
            <span>{t('nav.admin')}</span>
          </Link>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--primary-dark);
          color: #e2e8f0;
          padding: 4rem 0 0 0;
          margin-top: 4rem;
          border-top: 3px solid var(--accent-color);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 3rem;
          padding-bottom: 3rem;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .footer-about h3, .footer-links h4, .footer-contact h4 {
          color: var(--accent-color);
          margin-bottom: 1.25rem;
          font-weight: 700;
        }
        .footer-about p {
          color: #94a3b8;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          max-width: 450px;
        }
        .social-links {
          display: flex;
          gap: 0.75rem;
        }
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #e2e8f0;
          transition: var(--transition);
        }
        .social-icon:hover {
          transform: translateY(-3px);
          color: #ffffff;
        }
        .social-icon.fb:hover { background-color: #1877f2; }
        .social-icon.yt:hover { background-color: #ff0000; }
        .social-icon.wa:hover { background-color: #25d366; }
        .social-icon.ig:hover { background-color: #e1306c; }
        .social-icon.tt:hover { background-color: #010101; }

        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links a {
          color: #94a3b8;
          font-size: 0.95rem;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: var(--accent-color);
          padding-right: 5px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #94a3b8;
          font-size: 0.95rem;
        }
        .contact-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 0;
          background-color: rgba(0, 0, 0, 0.2);
          font-size: 0.85rem;
          color: #64748b;
        }
        .footer-bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .admin-portal-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #64748b;
          transition: var(--transition);
        }
        .admin-portal-link:hover {
          color: var(--accent-color);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
