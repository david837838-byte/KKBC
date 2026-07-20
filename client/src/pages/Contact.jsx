import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
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
      .catch(err => console.error(err));
  }, []);

  const churchName = settings?.churchName || t('common.fullChurchTitle');
  const email = settings?.contactEmail || 'info@churchqanafar.org';
  const phones = settings?.contactPhones || ['+961 70 123 456'];
  const address = settings?.address || t('contact.addressValue');
  const mapUrl = settings?.addressMapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13264.44473335439!2d35.733796590835974!3d33.615286591039845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ee68f237efb8d%3A0xe51a7024e036e4f3!2sKhirbet%20Qanafar!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb';
  
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/96170123456';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';

  return (
    <div className="contact-page container">
      <h1 className="section-title">{t('contact.title')}</h1>
      
      <p className="page-intro">
        {t('contact.subtitle')}
      </p>

      <div className="contact-layout">
        {/* Contact info cards */}
        <div className="contact-info-cards">
          {/* Physical Address */}
          <div className="contact-card glass-card">
            <MapPin size={24} className="card-icon" />
            <div className="card-details">
              <h3>{t('contact.address')}</h3>
              <p>{address}</p>
            </div>
          </div>

          {/* Phones */}
          <div className="contact-card glass-card">
            <Phone size={24} className="card-icon" />
            <div className="card-details">
              <h3>{t('contact.phone')}</h3>
              {phones.map((phone, idx) => (
                <p key={idx} dir="ltr" style={{ textAlign: language === 'ar' ? 'right' : 'left' }}>{phone}</p>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="contact-card glass-card">
            <Mail size={24} className="card-icon" />
            <div className="card-details">
              <h3>{t('contact.email')}</h3>
              <p>{email}</p>
            </div>
          </div>

          {/* Social connections */}
          <div className="contact-card glass-card">
            <MessageCircle size={24} className="card-icon" />
            <div className="card-details">
              <h3>{t('contact.socialMedia')}</h3>
              <div className="social-links-grid">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn fb">
                  <span>Facebook</span>
                </a>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn yt">
                  <span>YouTube</span>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn wa">
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn ig">
                  <span>Instagram</span>
                </a>
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn tt">
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
          {/* Counseling CTA card */}
          <div className="contact-card glass-card counseling-cta-card" style={{ borderRightColor: 'var(--accent-color)' }}>
            <div className="card-details" style={{ width: '100%' }}>
              <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {t('counseling.title')} 🕊️
              </h3>
              <p style={{ fontSize: '0.88rem', margin: '0.5rem 0 1rem', lineHeight: '1.5' }}>
                {t('counseling.subtitle')}
              </p>
              <a href="/counseling" className="btn btn-accent sm-btn" style={{ display: 'inline-flex', width: 'auto', padding: '0.5rem 1.25rem', fontWeight: 'bold' }}>
                {t('counseling.formTitle')}
              </a>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="map-view-wrapper glass-card">
          <h3>{language === 'ar' ? 'موقعنا الجغرافي على الخريطة' : 'Our Map Location'}</h3>
          <p>{t('contact.subtitle')}</p>
          <div className="iframe-map-container">
            <iframe
              src={mapUrl}
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: 'var(--radius-md)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Church Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
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
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .contact-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .contact-info-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .contact-card {
          display: flex;
          gap: 1.25rem;
          align-items: start;
          border-right: 4px solid var(--primary-color);
          border-left: 0;
        }
        [data-theme="dark"] .contact-card {
          border-right-color: var(--accent-color);
        }
        .contact-card .card-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .card-details h3 {
          font-size: 1.15rem;
          margin-bottom: 0.35rem;
        }
        .card-details p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .social-links-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.75rem;
          width: 100%;
        }
        .sm-btn {
          width: 100%;
          justify-content: flex-start;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }
        .sm-btn.fb:hover { background-color: #1877f2; color: white; border-color: #1877f2; }
        .sm-btn.yt:hover { background-color: #ff0000; color: white; border-color: #ff0000; }
        .sm-btn.wa:hover { background-color: #25d366; color: white; border-color: #25d366; }
        .sm-btn.ig:hover { background-color: #e1306c; color: white; border-color: #e1306c; }
        .sm-btn.tt:hover { background-color: #010101; color: white; border-color: #010101; }

        .map-view-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-top: 4px solid var(--accent-color);
        }
        .map-view-wrapper h3 {
          font-size: 1.3rem;
        }
        .map-view-wrapper p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .iframe-map-container {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-primary);
        }
      `}</style>
    </div>
  );
};

export default Contact;
