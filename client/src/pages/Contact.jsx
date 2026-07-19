import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Calendar } from 'lucide-react';

const Contact = () => {
  const [settings, setSettings] = useState(null);

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

  const churchName = settings?.churchName || 'الكنيسة المعمدانية الإنجيلية – خربة قنافار';
  const email = settings?.contactEmail || 'info@churchqanafar.org';
  const phones = settings?.contactPhones || ['+961 70 123 456'];
  const address = settings?.address || 'خربة قنافار، البقاع الغربي، لبنان';
  const mapUrl = settings?.addressMapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13264.44473335439!2d35.733796590835974!3d33.615286591039845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ee68f237efb8d%3A0xe51a7024e036e4f3!2sKhirbet%20Qanafar!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb';
  
  const facebookUrl = settings?.facebookUrl || 'https://facebook.com';
  const youtubeUrl = settings?.youtubeUrl || 'https://youtube.com';
  const whatsappUrl = settings?.whatsappUrl || 'https://wa.me/96170123456';
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com';
  const tiktokUrl = settings?.tiktokUrl || 'https://tiktok.com';

  return (
    <div className="contact-page container">
      <h1 className="section-title">تواصل معنا</h1>
      
      <p className="page-intro">
        يسعدنا تواصلكم معنا والإجابة على أي استفسارات تخص المواعيد أو الخدمات الروحية والاجتماعية التي تقدمها الكنيسة.
      </p>

      <div className="contact-layout">
        {/* Contact info cards */}
        <div className="contact-info-cards">
          {/* Physical Address */}
          <div className="contact-card glass-card">
            <MapPin size={24} className="card-icon" />
            <div className="card-details">
              <h3>موقع الكنيسة</h3>
              <p>{address}</p>
            </div>
          </div>

          {/* Phones */}
          <div className="contact-card glass-card">
            <Phone size={24} className="card-icon" />
            <div className="card-details">
              <h3>أرقام الهواتف</h3>
              {phones.map((phone, idx) => (
                <p key={idx} dir="ltr" style={{ textAlign: 'right' }}>{phone}</p>
              ))}
            </div>
          </div>

          {/* Email */}
          <div className="contact-card glass-card">
            <Mail size={24} className="card-icon" />
            <div className="card-details">
              <h3>البريد الإلكتروني</h3>
              <p>{email}</p>
            </div>
          </div>

          {/* Social connections */}
          <div className="contact-card glass-card">
            <MessageCircle size={24} className="card-icon" />
            <div className="card-details">
              <h3>قنوات التواصل الاجتماعي</h3>
              <div className="social-links-grid">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn fb">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  <span>صفحتنا على فيسبوك</span>
                </a>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn yt">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><path d="m10 15 5-3-5-3z"/></svg>
                  <span>قناتنا على يوتيوب</span>
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn wa">
                  <MessageCircle size={16} />
                  <span>محادثة عبر واتساب</span>
                </a>
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn ig">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  <span>حسابنا على انستجرام</span>
                </a>
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline sm-btn tt">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                  <span>حسابنا على تيك توك</span>
                </a>
              </div>
            </div>
          </div>
          {/* Counseling CTA card */}
          <div className="contact-card glass-card counseling-cta-card" style={{ borderRightColor: 'var(--accent-color)' }}>
            <div className="card-details" style={{ width: '100%' }}>
              <h3 style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                طلب إرشاد ومشورة سرية 🕊️
              </h3>
              <p style={{ fontSize: '0.88rem', margin: '0.5rem 0 1rem', lineHeight: '1.5' }}>
                إذا كنت تمر بظروف صعبة أو تحتاج إلى مشورة روحية شخصية وسرية مع راعي الكنيسة مباشرة، يمكنك تقديم طلبك عبر استمارة المشورة المحمية والمشفرة.
              </p>
              <a href="/counseling" className="btn btn-accent sm-btn" style={{ display: 'inline-flex', width: 'auto', padding: '0.5rem 1.25rem', fontWeight: 'bold' }}>
                تقديم طلب مشورة سرية
              </a>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="map-view-wrapper glass-card">
          <h3>موقعنا الجغرافي على الخريطة</h3>
          <p>تفضلوا بزيارتنا لحضور اجتماعات العبادة الأسبوعية. يمكنك اتباع الخريطة أدناه للوصول لمبنى الكنيسة:</p>
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
