import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Prayer = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    request: ''
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
    if (!formData.request.trim()) {
      setError(language === 'ar' ? 'من فضلك اكتب طلبة الصلاة قبل الإرسال.' : 'Please write your prayer request before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    fetch('/api/prayers', {
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
          setFormData({ name: '', phone: '', request: '' });
        } else {
          setError(data.message || (language === 'ar' ? 'حدث خطأ أثناء إرسال طلبة الصلاة. حاول مرة أخرى.' : 'Error sending prayer request. Try again.'));
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(language === 'ar' ? 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.' : 'Network connection error.');
      });
  };

  return (
    <div className="prayer-page container">
      <h1 className="section-title">{t('prayer.title')}</h1>

      <div className="prayer-container">
        {/* Intro Info */}
        <div className="prayer-info glass-card">
          <HeartHandshake size={44} className="prayer-info-icon" />
          <h2>{language === 'ar' ? '«لأَنَّهُ حَيْثُمَا اجْتَمَعَ اثْنَانِ أَوْ ثَلاَثَةٌ بِاسْمِي فَهُنَاكَ أَكُونُ فِي وَسَطِهِمْ»' : '«For where two or three gather in my name, there am I with them.»'}</h2>
          <span className="bible-ref">{language === 'ar' ? 'متى 18: 20' : 'Matthew 18:20'}</span>
          
          <p>
            {t('prayer.subtitle')}
          </p>

          <div className="info-badge">
            <Sparkles size={16} />
            <span>{language === 'ar' ? 'جميع الطلبات يتم التعامل معها بسرية مطلقة.' : 'All prayer requests are kept strictly confidential.'}</span>
          </div>
        </div>

        {/* Submit Form */}
        <div className="prayer-form-wrapper glass-card">
          {submitted ? (
            <div className="success-state">
              <CheckCircle2 size={64} className="success-icon" />
              <h2>{t('prayer.submitSuccess')}</h2>
              <button onClick={() => setSubmitted(false)} className="btn btn-primary">
                {t('prayer.sendPrayer')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="prayer-form">
              <h3>{t('prayer.formTitle')}</h3>
              <p className="form-sub">{language === 'ar' ? 'املأ النموذج أدناه. يمكنك ترك الاسم ورقم الهاتف فارغين إذا كنت تفضل إرسال الطلب بشكل مجهول.' : 'Fill out the form below. You can leave name and phone blank to submit anonymously.'}</p>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name (Optional) */}
              <div className="form-group">
                <label htmlFor="name">{language === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)'}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.namePlaceholder')}
                  className="form-control"
                />
              </div>

              {/* Phone (Optional) */}
              <div className="form-group">
                <label htmlFor="phone">{language === 'ar' ? 'رقم الهاتف (اختياري، للتواصل معك عند الحاجة)' : 'Phone Number (Optional, to contact you)'}</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('contact.phonePlaceholder')}
                  className="form-control"
                />
              </div>

              {/* Prayer Request (Required) */}
              <div className="form-group">
                <label htmlFor="request">{language === 'ar' ? 'طلبة الصلاة الخاصة بك (مطلوب)' : 'Your Prayer Request (Required)'}</label>
                <textarea 
                  id="request" 
                  name="request" 
                  value={formData.request}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'اكتب طلبة الصلاة بالتفصيل هنا...' : 'Write your prayer request in detail here...'}
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
                {loading ? t('common.loading') : t('prayer.sendPrayer')}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .prayer-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .prayer-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .prayer-container {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .prayer-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          border-top: 4px solid var(--accent-color);
        }
        .prayer-info-icon {
          color: var(--accent-color);
        }
        .prayer-info h2 {
          font-size: 1.4rem;
          color: var(--primary-color);
          font-style: italic;
          line-height: 1.5;
        }
        [data-theme="dark"] .prayer-info h2 {
          color: var(--accent-color);
        }
        .bible-ref {
          font-size: 0.9rem;
          color: var(--text-light);
          font-weight: 700;
          margin-top: -0.5rem;
        }
        .prayer-info p {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1.05rem;
        }
        .info-badge {
          margin-top: 1rem;
          background-color: rgba(26, 54, 93, 0.05);
          border: 1px dashed var(--border-color);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
          align-items: center;
          text-align: right;
        }
        [data-theme="dark"] .info-badge {
          background-color: rgba(255, 255, 255, 0.03);
        }
        .info-badge span {
          line-height: 1.5;
        }

        .prayer-form-wrapper {
          border-top: 4px solid var(--primary-color);
        }
        .prayer-form-wrapper h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .form-sub {
          color: var(--text-light);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .error-alert {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          margin-top: 0.5rem;
        }

        .success-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
          padding: 3rem 1rem;
        }
        .success-icon {
          color: var(--success-color);
        }
        .success-state h2 {
          font-size: 1.8rem;
          color: var(--success-color);
        }
        .success-state p {
          color: var(--text-secondary);
          max-width: 450px;
          line-height: 1.7;
        }
      `}</style>
    </div>
  );
};

export default Prayer;
