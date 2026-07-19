import React, { useState } from 'react';
import { ShieldCheck, MessageSquare, CheckCircle, AlertCircle, Info, Heart } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.details.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، وتفاصيل الطلب).');
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
          setError(data.message || 'حدث خطأ أثناء إرسال طلب المشورة. حاول مرة أخرى.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.');
      });
  };

  return (
    <div className="counseling-page container animate-fade-in">
      <div className="counseling-hero text-center">
        <ShieldCheck className="hero-icon" size={64} />
        <h1>طلب مشورة رعوية خاصة 🕊️</h1>
        <p className="page-intro">
          يسر راعي الكنيسة تقديم الإرشاد الروحي والمشورة الشخصية لكل من يمر بظروف صعبة أو يحتاج لتوجيه روحي مبني على كلمة الله بكل سرية وأمانة.
        </p>
      </div>

      <div className="counseling-container">
        {/* Info Box */}
        <div className="counseling-info glass-card">
          <Heart size={44} className="info-icon" />
          <h2>«أَمَّا الْمَشُورَةُ الصَّالِحَةُ فَتُنَجِّي»</h2>
          <span className="bible-ref">أمثال 11: 14</span>
          
          <p>
            نحن ندرك حساسية الأمور الشخصية والعائلية، لذلك نلتزم بـ **السرية التامة والمطلقة**.
          </p>
          <p>
            هذه الطلبات تُرسل **حصراً ومباشرة إلى راعي الكنيسة (القسيس)**، ولا يمكن لأي من الخدام أو المحررين الآخرين في الموقع الاطلاع عليها بأي حال من الأحوال.
          </p>

          <div className="privacy-badge">
            <ShieldCheck size={18} />
            <span>طلب آمن وسري ومحمي بالكامل 🔒</span>
          </div>
        </div>

        {/* Submit Form */}
        <div className="counseling-form-wrapper glass-card">
          {submitted ? (
            <div className="success-state">
              <CheckCircle size={64} className="success-icon" />
              <h2>تم إرسال طلب المشورة بنجاح!</h2>
              <p>
                تم استلام طلبك بأمان وسرية تامة. سيقوم القسيس بمراجعة طلبك والتواصل معك شخصياً بأسرع وقت ممكن عبر وسيلة الاتصال المفضلة التي اخترتها.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn btn-primary">
                تقديم طلب مشورة آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="counseling-form">
              <h3>استمارة طلب المشورة</h3>
              <p className="form-sub">يرجى إدخال بياناتك الصحيحة لنتمكن من التواصل معك لتقديم الدعم والإرشاد.</p>

              {error && (
                <div className="error-alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div className="form-group">
                <label htmlFor="name">الاسم الكامل (مطلبوب)</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="الاسم والكنية"
                  className="form-control"
                  required
                />
              </div>

              <div className="grid-2">
                {/* Phone */}
                <div className="form-group">
                  <label htmlFor="phone">رقم الهاتف الجوال (مطلوب)</label>
                  <input 
                    type="text" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="مثال: +961 70 000 000"
                    className="form-control"
                    dir="ltr"
                    style={{ textAlign: 'right' }}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@example.com"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div className="form-group">
                <label htmlFor="preferredContact">وسيلة التواصل المفضلة لديك</label>
                <select 
                  id="preferredContact" 
                  name="preferredContact" 
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="phone">اتصال هاتفي مباشر</option>
                  <option value="whatsapp">محادثة عبر واتساب (WhatsApp)</option>
                  <option value="meeting">طلب جلسة زيارة/مقابلة شخصية في مبنى الكنيسة</option>
                </select>
              </div>

              {/* Details */}
              <div className="form-group">
                <label htmlFor="details">تفاصيل طلب المشورة أو الإرشاد (مطلوب)</label>
                <textarea 
                  id="details" 
                  name="details" 
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="يرجى كتابة لمحة عامة عن الموضوع الذي ترغب في استشارة القس حوله بكل سرية..."
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
                {loading ? 'جاري إرسال الطلب بشكل آمن...' : 'تقديم طلب المشورة سرّاً'}
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
