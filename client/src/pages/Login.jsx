import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

const Login = ({ isAdmin, setIsAdmin }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      setError('يرجى كتابة اسم المستخدم وكلمة المرور.');
      return;
    }

    setLoading(true);
    setError('');

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrUsername, password })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success && data.data) {
          localStorage.setItem('token', data.data.token);
          setIsAdmin(true);
          navigate('/admin');
        } else {
          setError(data.message || 'بيانات الدخول غير صحيحة. يرجى التحقق وإعادة المحاولة.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError('حدث خطأ أثناء الاتصال بالخادم. يرجى إعادة المحاولة.');
      });
  };

  return (
    <div className="login-page container">
      <div className="login-card glass-card">
        <div className="login-logo-wrapper">
          <Logo showText={false} />
        </div>
        
        <h2>بوابة تسجيل الدخول للإدارة</h2>
        <p className="login-sub">هذه الصفحة مخصصة لخدام الكنيسة ومسؤولي إدارة الموقع لتحديث البيانات وتعديل المحتوى.</p>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* Email or Username */}
          <div className="form-group">
            <label htmlFor="identity">اسم المستخدم أو البريد الإلكتروني</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                id="identity" 
                value={emailOrUsername} 
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="مثال: admin"
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">كلمة المرور</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 180px);
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        .login-card {
          max-width: 480px;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          border-top: 5px solid var(--primary-color);
          padding: 3rem 2rem;
        }
        .login-logo-wrapper {
          width: 70px;
          height: 70px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
          margin-bottom: 0.5rem;
        }
        .login-card h2 {
          font-size: 1.45rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .login-card h2 {
          color: var(--accent-color);
        }
        .login-sub {
          font-size: 0.85rem;
          color: var(--text-light);
          line-height: 1.5;
        }
        .login-form {
          width: 100%;
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .input-with-icon {
          position: relative;
          width: 100%;
        }
        .input-with-icon input {
          padding-right: 2.75rem; /* space for icon on right */
          width: 100%;
        }
        .input-icon {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        .login-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        .error-alert {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error-color);
          color: var(--error-color);
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default Login;
