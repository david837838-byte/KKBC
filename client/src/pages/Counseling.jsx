import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, CheckCircle, AlertCircle, Info, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Counseling = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredContact: 'phone',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useLanguage();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.details.trim()) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، وتفاصيل الطلب).' : 'Please fill out all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    fetch('/api/counseling', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSubmitted(true);
          setFormData({ name: '', phone: '', email: '', preferredContact: 'phone', details: '' });
        } else {
          setError(data.message || (language === 'ar' ? 'حدث خطأ أثناء إرسال طلب المشورة. حاول مرة أخرى.' : 'Error sending request.'));
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.' : 'Network error.');
      });
  };

  return (
    <div className="counseling-page container animate-fade-in">
      <div className="counseling-hero text-center">
        <ShieldCheck className="hero-icon" size={64} />
        <h1>{t('counseling.title')} 🕊️</h1>
        <p className="page-intro">
          {t('counseling.subtitle')}
        </p>
      </div>

      <div className="counseling-container">
        {/* Info Box */}
        <div className="counseling-info glass-card">
          <Heart size={44} className="info-icon" />
          <h2>«أَمَّا الْمَشُورَةُ الصَّالِحَةُ فَتُنَجِّي»</h2>
          <span className="bible-ref">{language === 'ar' ? 'أمثال 11: 14' : 'Proverbs 11:14'}</span>
          
          <p>
            {t('counseling.subtitle')}
          </p>

          <div className="privacy-badge">
            <ShieldCheck size={18} />
            <span>{language === 'ar' ? 'طلب آمن وسري ومحمي بالكامل 🔒' : 'Secure, confidential request 🔒'}</span>
          </div>
        </div>

        {/* Submit Form */}
        <div className="counseling-form-wrapper glass-card">
          {submitted ? (
            <div className="success-state">
              <CheckCircle size={64} className="success-icon" />
              <h2>{t('counseling.counselingSuccess')}</h2>
              <button onClick={() => setSubmitted(false)} className="btn btn-primary">
                {t('counseling.formTitle')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="counseling-form">
              <h3>{t('counseling.formTitle')}</h3>
              <p className="form-sub">{language === 'ar' ? 'يرجى إدخال بياناتك الصحيحة لنتمكن من التواصل معك لتقديم الدعم والإرشاد.' : 'Please enter your contact info so we can reach out with support and advice.'}</p>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">{t('contact.name')} ({language === 'ar' ? 'مطلوب' : 'Required'})</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  className="form-control"
                  required
                />
              </div>

              <div className="grid-2">
                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">{t('contact.phone')} ({language === 'ar' ? 'مطلوب' : 'Required'})</label>
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contact.phonePlaceholder')}
                    className="form-control"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">{t('contact.email')} ({language === 'ar' ? 'اختياري' : 'Optional'})</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.emailPlaceholder')}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="form-group">
                <label htmlFor="preferredContact">{t('counseling.preferredTime')}</label>
                <select 
                  id="preferredContact" 
                  name="preferredContact" 
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="phone">{language === 'ar' ? 'اتصال هاتفي مباشر' : 'Direct Phone Call'}</option>
                  <option value="whatsapp">{language === 'ar' ? 'محادثة عبر واتساب (WhatsApp)' : 'WhatsApp Conversation'}</option>
                  <option value="meeting">{language === 'ar' ? 'طلب جلسة زيارة/مقابلة شخصية في الكنيسة' : 'In-Person Pastoral Meeting'}</option>
                </select>
              </div>

              {/* Details */}
              <div className="form-group">
                <label htmlFor="details">{t('counseling.topic')} ({language === 'ar' ? 'مطلوب' : 'Required'})</label>
                <textarea 
                  id="details" 
                  name="details" 
                  value={formData.details}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'يرجى كتابة لمحة عامة عن الموضوع...' : 'Please write a brief summary of the subject...'}
                  rows="6"
                  className="form-control"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={loading}
              >
                {loading ? t('common.loading') : t('counseling.bookAppointment')}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .counseling-page {
          padding-top: 3rem;
          padding-bottom: 5rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .counseling-hero {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .counseling-hero .hero-icon {
          color: var(--accent-color);
        }
        .counseling-hero h1 {
          font-size: 2.2rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .counseling-hero h1 {
          color: white;
        }
        .counseling-container {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .counseling-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .counseling-info {
          padding: 2.5rem;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .counseling-info h2 {
          font-size: 1.4rem;
          color: var(--primary-color);
          font-weight: 700;
          font-style: italic;
        }
        [data-theme="dark"] .counseling-info h2 {
          color: var(--accent-color);
        }
        .counseling-info .info-icon {
          color: var(--accent-color);
        }
        .counseling-info p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .privacy-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(76, 175, 80, 0.1);
          border: 1px solid rgba(76, 175, 80, 0.2);
          color: #4caf50;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: bold;
          margin-top: 0.5rem;
          align-self: flex-start;
        }
        .counseling-form-wrapper {
          padding: 2.5rem;
          border: 1px solid var(--border-color);
        }
        .counseling-form h3 {
          font-size: 1.4rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .counseling-form h3 {
          color: white;
        }
        .form-sub {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }
        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          font-weight: 700;
          font-size: 1rem;
          margin-top: 1rem;
        }
        .success-state {
          text-align: center;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .success-icon {
          color: #4caf50;
        }
        .success-state p {
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 500px;
        }
      `}</style>
    </div>
  );
};

export default Counseling;
