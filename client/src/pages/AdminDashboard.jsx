import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, Calendar, BookOpen, Music, Image, HeartHandshake, Settings, Users, 
  Trash2, Plus, Edit2, Check, Bell, Upload, LogOut, CheckCircle, Info, BarChart3,
  ShieldAlert, Bot, AlertCircle, FileText, Database, Download
} from 'lucide-react';
import io from 'socket.io-client';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('livestream');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userProfile, setUserProfile] = useState(null);
  const [newPrayerCount, setNewPrayerCount] = useState(0);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isAr = language === 'ar';

  // Fetch website settings for visitor count
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSettings(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Authentication check
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch profile
    fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success) {
          setUserProfile(data.data);
        }
      })
      .catch(err => console.error(err));
  }, [token, navigate]);

  // Socket.io for new prayer alerts
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    
    socket.on('newPrayerRequest', () => {
      setNewPrayerCount(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="admin-page container-fluid">
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar glass-card">
          <div className="admin-user-info">
            <div className="avatar-placeholder">{userProfile?.username?.substring(0, 2).toUpperCase()}</div>
            <div>
              <h4>{userProfile?.username}</h4>
              <span className="role-tag">{userProfile?.role === 'admin' ? (isAr ? 'مدير كامل' : 'Full Admin') : (isAr ? 'محرر' : 'Editor')}</span>
              {settings?.visitorCount !== undefined && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.35rem', fontWeight: 'bold' }}>
                  {isAr ? `زيارات الموقع: ${settings.visitorCount}` : `Site Visits: ${settings.visitorCount}`}
                </div>
              )}
            </div>
          </div>

          <ul className="sidebar-menu">
            <li className={activeTab === 'livestream' ? 'active' : ''} onClick={() => setActiveTab('livestream')}>
              <Radio size={18} />
              <span>{isAr ? 'البث المباشر' : 'Live Stream'}</span>
            </li>
            <li className={activeTab === 'meetings' ? 'active' : ''} onClick={() => setActiveTab('meetings')}>
              <Calendar size={18} />
              <span>{isAr ? 'الاجتماعات الأسبوعية' : 'Weekly Meetings'}</span>
            </li>
            <li className={activeTab === 'sermons' ? 'active' : ''} onClick={() => setActiveTab('sermons')}>
              <BookOpen size={18} />
              <span>{isAr ? 'العظات والتعليم' : 'Sermons & Teaching'}</span>
            </li>
            <li className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>
              <Info size={18} />
              <span>{isAr ? 'الأخبار والإعلانات' : 'News & Announcements'}</span>
            </li>
            <li className={activeTab === 'articles' ? 'active' : ''} onClick={() => setActiveTab('articles')}>
              <FileText size={18} />
              <span>{isAr ? 'المقالات والدراسات' : 'Articles & Studies'}</span>
            </li>
            <li className={activeTab === 'hymns' ? 'active' : ''} onClick={() => setActiveTab('hymns')}>
              <Music size={18} />
              <span>{isAr ? 'الترانيم' : 'Hymns'}</span>
            </li>
            <li className={activeTab === 'gallery' ? 'active' : ''} onClick={() => setActiveTab('gallery')}>
              <Image size={18} />
              <span>{isAr ? 'معرض الصور والفيديو' : 'Gallery'}</span>
            </li>
            <li className={activeTab === 'prayers' ? 'active' : ''} onClick={() => { setActiveTab('prayers'); setNewPrayerCount(0); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <HeartHandshake size={18} />
                <span>{isAr ? 'طلبات الصلاة' : 'Prayer Requests'}</span>
                {newPrayerCount > 0 && <span className="alert-count-badge">{newPrayerCount}</span>}
              </div>
            </li>
            <li className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
              <BarChart3 size={18} />
              <span>{isAr ? 'إحصائيات الزيارات' : 'Visit Analytics'}</span>
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
              <Settings size={18} />
              <span>{isAr ? 'إعدادات الموقع' : 'Site Settings'}</span>
            </li>
            <li className={activeTab === 'daily-verses' ? 'active' : ''} onClick={() => setActiveTab('daily-verses')}>
              <BookOpen size={18} />
              <span>{isAr ? 'آيات اليوم' : 'Daily Verses'}</span>
            </li>
            {userProfile?.role === 'admin' && (
              <>
                <li className={activeTab === 'chatbot' ? 'active' : ''} onClick={() => setActiveTab('chatbot')}>
                  <Bot size={18} />
                  <span>{isAr ? 'الذكاء الاصطناعي' : 'AI Assistant'}</span>
                </li>
                <li className={activeTab === 'counseling' ? 'active' : ''} onClick={() => setActiveTab('counseling')}>
                  <HeartHandshake size={18} />
                  <span>{isAr ? 'طلبات الإرشاد والمشورة' : 'Counseling Requests'}</span>
                </li>
                <li className={activeTab === 'lockouts' ? 'active' : ''} onClick={() => setActiveTab('lockouts')}>
                  <ShieldAlert size={18} />
                  <span>{isAr ? 'الأجهزة المحظورة' : 'Blocked Devices'}</span>
                </li>
                <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                  <Users size={18} />
                  <span>{isAr ? 'إدارة المدراء' : 'User Management'}</span>
                </li>
              </>
            )}
            {(userProfile?.role === 'admin' || userProfile?.canManageExpenses) && (
              <li className={activeTab === 'expenses' ? 'active' : ''} onClick={() => setActiveTab('expenses')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                  <span style={{ fontSize: '18px' }}>💰</span>
                  <span>{isAr ? 'المصاريف الكنسية' : 'Church Expenses'}</span>
                </div>
              </li>
            )}
            <li className="logout-item" onClick={handleLogout}>
              <LogOut size={18} />
              <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
            </li>
          </ul>
        </aside>

        {/* Content Area */}
        <main className="admin-content glass-card">
          {activeTab === 'livestream' && <LiveStreamTab token={token} />}
          {activeTab === 'meetings' && <MeetingsTab token={token} />}
          {activeTab === 'sermons' && <SermonsTab token={token} />}
          {activeTab === 'news' && <NewsTab token={token} />}
          {activeTab === 'articles' && <ArticlesTab token={token} />}
          {activeTab === 'hymns' && <HymnsTab token={token} />}
          {activeTab === 'gallery' && <GalleryTab token={token} />}
          {activeTab === 'prayers' && <PrayersTab token={token} />}
          {activeTab === 'analytics' && <AnalyticsTab token={token} />}
          {activeTab === 'chatbot' && userProfile?.role === 'admin' && <ChatbotTab token={token} />}
          {activeTab === 'counseling' && userProfile?.role === 'admin' && <CounselingTab token={token} />}
          {activeTab === 'lockouts' && userProfile?.role === 'admin' && <LockoutsTab token={token} />}
          {activeTab === 'settings' && <SettingsTab token={token} />}
          {activeTab === 'daily-verses' && <DailyVersesTab token={token} />}
          {activeTab === 'users' && userProfile?.role === 'admin' && <UsersTab token={token} />}
          {activeTab === 'expenses' && (userProfile?.role === 'admin' || userProfile?.canManageExpenses) && <ExpensesTab token={token} />}
        </main>
      </div>

      <style>{`
        .admin-page {
          padding: 2rem 0;
          min-height: calc(100vh - 120px);
        }
        .admin-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          max-width: 1350px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        @media (max-width: 992px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }
        }
        .admin-sidebar {
          padding: 1.5rem;
          height: fit-content;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (max-width: 992px) {
          .admin-sidebar {
            max-height: 400px;
            position: relative;
            top: 0;
          }
        }
        .admin-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.25rem;
        }
        .avatar-placeholder {
          width: 45px;
          height: 45px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.1rem;
        }
        .role-tag {
          font-size: 0.75rem;
          background-color: rgba(26, 54, 93, 0.08);
          color: var(--primary-color);
          padding: 0.1rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
          display: inline-block;
          margin-top: 0.15rem;
        }
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .sidebar-menu li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .sidebar-menu li:hover, .sidebar-menu li.active {
          color: var(--primary-color);
          background-color: rgba(26, 54, 93, 0.06);
        }
        [data-theme="dark"] .sidebar-menu li:hover, [data-theme="dark"] .sidebar-menu li.active {
          color: var(--accent-color);
          background-color: rgba(255, 255, 255, 0.05);
        }
        .sidebar-menu li.logout-item {
          color: var(--error-color);
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
          padding-top: 1rem;
          border-radius: 0;
        }
        .sidebar-menu li.logout-item:hover {
          background-color: rgba(239, 68, 68, 0.06);
        }
        .alert-count-badge {
          background-color: var(--error-color);
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: 9999px;
          margin-right: auto; /* Push to left in RTL */
        }
        .admin-content {
          padding: 2rem;
          min-height: 500px;
        }
        
        /* General Inner Tab Styling */
        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }
        .tab-header h2 {
          font-size: 1.5rem;
        }
        .admin-btn-action {
          padding: 0.35rem 0.6rem;
          font-size: 0.85rem;
          background: transparent;
          border: 1px solid var(--border-color);
          cursor: pointer;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        .admin-btn-action:hover {
          background: var(--border-color);
        }
        .admin-btn-delete {
          color: var(--error-color);
        }
        .admin-btn-delete:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
        .admin-alert-success {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success-color);
          color: var(--success-color);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
   TAB: Live Stream
   ========================================================================= */
const LiveStreamTab = ({ token }) => {
  const [isLive, setIsLive] = useState(false);
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    fetch('/api/livestream')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setIsLive(data.data.isLive);
          setPlatform(data.data.platform || 'youtube');
          setUrl(data.data.url || '');
          setTitle(data.data.title || '');
          setDescription(data.data.description || '');
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    fetch('/api/livestream', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ isLive, platform, url, title, description })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess(isAr ? 'تم تحديث حالة إعدادات البث المباشر بنجاح وبثها للموقع!' : 'Live stream settings updated and published successfully!');
          setTimeout(() => setSuccess(''), 4000);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{isAr ? 'إدارة البث المباشر للموقع' : 'Live Stream Management'}</h2>
      </div>

      {success && (
        <div className="admin-alert-success">
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
            <input 
              type="checkbox" 
              checked={isLive} 
              onChange={(e) => setIsLive(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            {isAr ? 'بث مباشر نشط حالياً (تفعيل البث المباشر في الصفحة الرئيسية)' : 'Live Stream Currently Active (Enable Live Banner on Home Page)'}
          </label>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>{isAr ? 'منصة البث' : 'Streaming Platform'}</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="form-control">
              <option value="youtube">{isAr ? 'يوتيوب (YouTube Live)' : 'YouTube Live'}</option>
              <option value="facebook">{isAr ? 'فيسبوك (Facebook Live)' : 'Facebook Live'}</option>
              <option value="other">{isAr ? 'رابط بث خارجي / منصة أخرى' : 'External Stream / Other Platform'}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{isAr ? 'رابط البث المباشر (URL)' : 'Live Stream URL'}</label>
            <input 
              type="text" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              placeholder={isAr ? 'مثال: https://www.youtube.com/watch?v=...' : 'https://www.youtube.com/live/...'} 
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>{isAr ? 'عنوان البث' : 'Stream Title'}</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder={isAr ? 'مثال: بث مباشر لاجتماع العبادة الأسبوعي' : 'e.g., Weekly Worship Live Stream'} 
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>{isAr ? 'وصف البث / تفاصيل' : 'Stream Description / Details'}</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder={isAr ? 'مثال: انضموا إلينا للمشاركة في العبادة...' : 'Join us live for worship and scripture...'} 
            rows="3" 
            className="form-control"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? (isAr ? 'جاري الحفظ والتعميم...' : 'Saving & Publishing...') : (isAr ? 'حفظ ونشر التعديلات' : 'Save & Publish Changes')}
        </button>
      </form>
    </div>
  );
};

/* =========================================================================
   TAB: Meetings
   ========================================================================= */
const MeetingsTab = ({ token }) => {
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  // Form State
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('الأحد');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('مبنى الكنيسة');
  const [order, setOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const fetchMeetings = () => {
    fetch('/api/meetings/admin', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setMeetings(data.data);
      });
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleEdit = (m) => {
    setEditingId(m._id);
    setTitle(m.title);
    setDay(m.day);
    setTime(m.time);
    setDescription(m.description || '');
    setLocation(m.location || 'مبنى الكنيسة');
    setOrder(m.order || '0');
    setIsActive(m.isActive);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDay('الأحد');
    setTime('');
    setDescription('');
    setLocation('مبنى الكنيسة');
    setOrder('0');
    setIsActive(true);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const endpoint = editingId ? `/api/meetings/${editingId}` : '/api/meetings';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, day, time, description, location, order: Number(order), isActive })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || (isAr ? 'فشلت عملية حفظ الاجتماع.' : 'Failed to save meeting.')); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSuccess(editingId ? (isAr ? 'تم تعديل الاجتماع بنجاح!' : 'Meeting updated successfully!') : (isAr ? 'تم إضافة الاجتماع بنجاح!' : 'Meeting added successfully!'));
          setTimeout(() => setSuccess(''), 4000);
          fetchMeetings();
          handleCancel();
        }
      })
      .catch(err => {
        setError(err.message || (isAr ? 'حدث خطأ أثناء حفظ الاجتماع.' : 'Error saving meeting.'));
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الاجتماع الأسبوعي؟' : 'Are you sure you want to delete this meeting?')) {
      fetch(`/api/meetings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || (isAr ? 'فشلت عملية الحذف.' : 'Delete failed.')); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess(isAr ? 'تم حذف الاجتماع بنجاح!' : 'Meeting deleted successfully!');
            setTimeout(() => setSuccess(''), 4000);
            fetchMeetings();
          }
        })
        .catch(err => {
          setError(err.message || (isAr ? 'حدث خطأ أثناء الحذف.' : 'Error deleting.'));
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{isAr ? 'إدارة الاجتماعات الأسبوعية' : 'Weekly Meetings Management'}</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>{isAr ? 'إضافة اجتماع جديد' : 'Add New Meeting'}</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? (isAr ? 'تعديل اجتماع' : 'Edit Meeting') : (isAr ? 'إضافة اجتماع جديد' : 'Add New Meeting')}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>{isAr ? 'عنوان الاجتماع' : 'Meeting Title'}</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" placeholder="مثال: اجتماع العبادة" />
            </div>
            
            <div className="form-group">
              <label>{isAr ? 'اليوم' : 'Day'}</label>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="form-control">
                <option value="الأحد">{isAr ? 'الأحد' : 'Sunday'}</option>
                <option value="الإثنين">{isAr ? 'الإثنين' : 'Monday'}</option>
                <option value="الثلاثاء">{isAr ? 'الثلاثاء' : 'Tuesday'}</option>
                <option value="الأربعاء">{isAr ? 'الأربعاء' : 'Wednesday'}</option>
                <option value="الخميس">{isAr ? 'الخميس' : 'Thursday'}</option>
                <option value="الجمعة">{isAr ? 'الجمعة' : 'Friday'}</option>
                <option value="السبت">{isAr ? 'السبت' : 'Saturday'}</option>
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>{isAr ? 'الوقت' : 'Time'}</label>
              <input type="text" value={time} onChange={(e) => setTime(e.target.value)} required className="form-control" placeholder="مثال: 10:00 صباحاً" />
            </div>

            <div className="form-group">
              <label>{isAr ? 'الموقع / القاعة' : 'Location'}</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="form-control" />
            </div>

            <div className="form-group">
              <label>{isAr ? 'الترتيب' : 'Order'}</label>
              <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label>{isAr ? 'وصف مختصر للاجتماع' : 'Short Description'}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="form-control"></textarea>
          </div>

          <div className="form-group" style={{ flexDirection: 'row', gap: '0.5rem', alignItems: 'center' }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            <label>{isAr ? 'نشط ويظهر في الموقع' : 'Active and visible on site'}</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">{isAr ? 'حفظ' : 'Save'}</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>{isAr ? 'إلغاء' : 'Cancel'}</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>الترتيب</th>
                <th>اليوم</th>
                <th>الوقت</th>
                <th>الاسم</th>
                <th>المكان</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((m) => (
                <tr key={m._id}>
                  <td>{m.order}</td>
                  <td><strong>{m.day}</strong></td>
                  <td>{m.time}</td>
                  <td>{m.title}</td>
                  <td>{m.location}</td>
                  <td>{m.isActive ? <span style={{ color: 'var(--success-color)' }}>نشط</span> : <span style={{ color: 'var(--text-light)' }}>غير نشط</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn-action" onClick={() => handleEdit(m)}><Edit2 size={14} /></button>
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(m._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   TAB: Sermons (with File Upload handling)
   ========================================================================= */
const SermonsTab = ({ token }) => {
  const [sermons, setSermons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('video');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSermons = () => {
    fetch('/api/sermons')
      .then(res => res.json())
      .then(data => {
        if (data.success) setSermons(data.data);
      });
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleEdit = (s) => {
    setEditingId(s._id);
    setTitle(s.title);
    setPreacher(s.preacher);
    // Format date string to match YYYY-MM-DD input format
    const sDate = s.date ? new Date(s.date).toISOString().split('T')[0] : '';
    setDate(sDate);
    setType(s.type);
    setUrl(s.url || '');
    setCategory(s.category);
    setDescription(s.description || '');
    setFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setPreacher('');
    setDate('');
    setType('video');
    setUrl('');
    setCategory('');
    setDescription('');
    setFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('preacher', preacher);
    formData.append('date', date);
    formData.append('type', type);
    formData.append('url', url);
    formData.append('category', category);
    formData.append('description', description);
    
    if (file) {
      formData.append('sermonFile', file);
    }

    const endpoint = editingId ? `/api/sermons/${editingId}` : '/api/sermons';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type header when using FormData; fetch sets it automatically with the boundary
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حفظ العظة.'); });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess(editingId ? 'تم تعديل العظة بنجاح!' : 'تم إضافة العظة بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchSermons();
          handleCancel();
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء حفظ العظة.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف هذه العظة؟')) {
      fetch(`/api/sermons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية الحذف.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف العظة بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchSermons();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>إدارة عظات وتعليم الكنيسة</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>إضافة عظة جديدة</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'تعديل عظة' : 'إضافة عظة جديدة'}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>عنوان العظة</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>
            
            <div className="form-group">
              <label>الواعظ</label>
              <input type="text" value={preacher} onChange={(e) => setPreacher(e.target.value)} required className="form-control" />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label>تاريخ العظة</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>التصنيف</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثال: النمو الروحي" required className="form-control" />
            </div>

            <div className="form-group">
              <label>نوع الوسيط</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="form-control">
                <option value="video">فيديو (يوتيوب)</option>
                <option value="audio">ملف صوتي (تحميل ملف أو بث)</option>
                <option value="pdf">ملف PDF / دراسة مكتوبة</option>
              </select>
            </div>
          </div>

          {/* Conditional Media URL or upload */}
          <div className="form-group">
            <label>رابط يوتيوب أو رابط خارجي (مطلوب لعظات الفيديو)</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="form-control" placeholder="https://..." />
          </div>

          <div className="form-group">
            <label>تحميل ملف صوتي أو ملف PDF (بديل في حال عدم استخدام رابط خارجي)</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="form-control" 
              accept=".mp3,.wav,.pdf"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <Upload size={12} /> يسمح برفع صيغ MP3 للملفات الصوتية، أو صيغة PDF للدراسات المكتوبة.
            </span>
          </div>

          <div className="form-group">
            <label>وصف ملخص للعظة</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="form-control"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري رفع الملف وحفظ البيانات...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>تاريخ النشر</th>
                <th>العنوان</th>
                <th>الواعظ</th>
                <th>التصنيف</th>
                <th>نوع الوسيط</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((s) => (
                <tr key={s._id}>
                  <td>{new Date(s.date).toLocaleDateString('ar-LB')}</td>
                  <td><strong>{s.title}</strong></td>
                  <td>{s.preacher}</td>
                  <td>{s.category}</td>
                  <td>{s.type === 'video' ? 'فيديو' : s.type === 'audio' ? 'صوت' : 'دراسة PDF'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn-action" onClick={() => handleEdit(s)}><Edit2 size={14} /></button>
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(s._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   TAB: News (with File Upload handling)
   ========================================================================= */
const NewsTab = ({ token }) => {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('news');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNews = () => {
    fetch('/api/news/admin', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setNews(data.data);
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category || 'news');
    setDate(item.date ? item.date.substring(0, 10) : '');
    setFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('news');
    setDate('');
    setFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('date', date);

    if (file) {
      formData.append('newsImage', file);
    }

    const endpoint = editingId ? `/api/news/${editingId}` : '/api/news';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        setLoading(false);
        if (!res.ok) throw new Error(isAr ? 'فشلت عملية حفظ الخبر.' : 'Failed to save news.');
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSuccess(editingId ? (isAr ? 'تم تعديل الخبر بنجاح!' : 'News item updated successfully!') : (isAr ? 'تم إضافة الخبر بنجاح!' : 'News item added successfully!'));
          setTimeout(() => setSuccess(''), 4000);
          fetchNews();
          handleCancel();
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء حفظ الخبر.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف هذا الخبر/الإعلان؟')) {
      fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية الحذف.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف الخبر بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchNews();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>إدارة الأخبار والإعلانات</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>إضافة خبر/إعلان جديد</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'تعديل الخبر' : 'إضافة خبر/إعلان جديد'}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>عنوان الخبر</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>
            
            <div className="form-group">
              <label>التصنيف</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                <option value="news">خبر عام</option>
                <option value="announcement">إعلان كنسي</option>
                <option value="event">فعالية ومخيم</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>التاريخ</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>إرفاق صورة للخبر</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                className="form-control" 
                accept="image/*"
              />
            </div>
          </div>

          <div className="form-group">
            <label>محتوى الخبر / الإعلان بالتفصيل</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="5" className="form-control"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري رفع الملف وحفظ البيانات...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>تاريخ النشر</th>
                <th>العنوان</th>
                <th>النوع</th>
                <th>صورة مرفقة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item._id}>
                  <td>{new Date(item.date).toLocaleDateString('ar-LB')}</td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.category === 'event' ? 'فعالية' : item.category === 'announcement' ? 'إعلان' : 'خبر'}</td>
                  <td>{item.imageUrl ? <span style={{ color: 'var(--success-color)' }}>نعم</span> : <span style={{ color: 'var(--text-light)' }}>لا</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn-action" onClick={() => handleEdit(item)}><Edit2 size={14} /></button>
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(item._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const HymnsTab = ({ token }) => {
  const [hymns, setHymns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Form State
  const [title, setTitle] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('عامة');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [activePresenterHymn, setActivePresenterHymn] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHymns = () => {
    fetch('/api/hymns')
      .then(res => res.json())
      .then(data => {
        if (data.success) setHymns(data.data);
      });
  };

  const fetchActivePresenterHymn = () => {
    fetch('/api/hymns/present/active')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActivePresenterHymn(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHymns();
    fetchActivePresenterHymn();
  }, []);

  // Listen for socket updates if active presenter changes
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    socket.on('hymnPresentationUpdate', (hymn) => {
      setActivePresenterHymn(hymn);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleEdit = (h) => {
    setEditingId(h._id);
    setTitle(h.title);
    setLyrics(h.lyrics || '');
    setAudioUrl(h.audioUrl || '');
    setVideoUrl(h.videoUrl || '');
    setCategory(h.category || 'عامة');
    setImageUrl(h.imageUrl || '');
    setFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setLyrics('');
    setAudioUrl('');
    setVideoUrl('');
    setCategory('عامة');
    setImageUrl('');
    setFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!lyrics && !file && !imageUrl) {
      setError(isAr ? 'يرجى إدخال كلمات الترنيمة أو إرفاق صورة/ملف للكلمات.' : 'Please enter hymn lyrics or upload an image/file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('lyrics', lyrics);
    formData.append('audioUrl', audioUrl);
    formData.append('videoUrl', videoUrl);
    formData.append('category', category);
    formData.append('imageUrl', imageUrl);
    if (file) {
      formData.append('lyricsImage', file);
    }

    const endpoint = editingId ? `/api/hymns/${editingId}` : '/api/hymns';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || (isAr ? 'فشلت عملية حفظ الترنيمة.' : 'Failed to save hymn.')); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSuccess(editingId ? (isAr ? 'تم تعديل الترنيمة بنجاح!' : 'Hymn updated successfully!') : (isAr ? 'تم إضافة الترنيمة الجديدة بنجاح!' : 'New hymn added successfully!'));
          setTimeout(() => setSuccess(''), 4000);
          fetchHymns();
          fetchActivePresenterHymn();
          handleCancel();
        }
      })
      .catch(err => {
        setError(err.message || (isAr ? 'حدث خطأ غير متوقع.' : 'Unexpected error.'));
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الترنيمة؟' : 'Are you sure you want to delete this hymn?')) {
      fetch(`/api/hymns/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || (isAr ? 'فشلت عملية الحذف.' : 'Delete failed.')); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess(isAr ? 'تم حذف الترنيمة بنجاح!' : 'Hymn deleted successfully!');
            setTimeout(() => setSuccess(''), 4000);
            fetchHymns();
            fetchActivePresenterHymn();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  const handlePresent = (hymn) => {
    fetch('/api/hymns/present/active', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ hymn })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess(`تم بدء عرض الترنيمة "${hymn.title}" على الشاشة! 📺`);
          setTimeout(() => setSuccess(''), 3000);
        }
      })
      .catch(err => {
        setError('فشل في إرسال الترنيمة للشاشة.');
        setTimeout(() => setError(''), 3000);
      });
  };

  const handleClearPresentation = () => {
    fetch('/api/hymns/present/active', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ hymn: null })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess('تم إيقاف عرض الشاشة وتفريغها ✖️');
          setTimeout(() => setSuccess(''), 3000);
        }
      })
      .catch(err => {
        setError('فشل في إيقاف العرض.');
        setTimeout(() => setError(''), 3000);
      });
  };

  const filteredHymns = hymns.filter(h => 
    h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.lyrics && h.lyrics.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h.category && h.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="tab-header">
        <h2>إدارة الترانيم والعبادة</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a 
            href="/hymns/present" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-outline" 
            style={{ 
              borderColor: 'var(--accent-color)', 
              color: 'var(--accent-color)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              textDecoration: 'none',
              padding: '0.5rem 0.85rem'
            }}
          >
            <span>شاشة العرض والبروجكتر 📺</span>
          </a>
          {activePresenterHymn && (
            <button className="btn btn-outline" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)' }} onClick={handleClearPresentation}>
              إيقاف العرض الحي ✖️
            </button>
          )}
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              <span>إضافة ترنيمة جديدة</span>
            </button>
          )}
        </div>
      </div>

      {activePresenterHymn && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(197, 168, 128, 0.12)',
          border: '1px dashed var(--accent-color)',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          animation: 'fadeIn 0.5s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📺</span>
            <span style={{ fontWeight: 'bold' }}>
              المعروض حالياً على الشاشة: <span style={{ color: 'var(--accent-color)' }}>{activePresenterHymn.title}</span>
            </span>
          </div>
          <button className="btn btn-outline" style={{ borderColor: 'var(--error-color)', color: 'var(--error-color)', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }} onClick={handleClearPresentation}>
            إيقاف العرض ✖️
          </button>
        </div>
      )}

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'تعديل ترنيمة' : 'إضافة ترنيمة جديدة'}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>عنوان الترنيمة</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>التصنيف</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" placeholder="مثال: تسبيح وعبادة، ترانيم أطفال" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>رابط فيديو يوتيوب (اختياري)</label>
              <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="form-control" placeholder="https://youtube.com/..." />
            </div>

            <div className="form-group">
              <label>رابط ملف صوتي (اختياري)</label>
              <input type="text" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="form-control" placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label>رفع صورة الترنيمة (اختياري - بدلاً من الكلمات أو معها)</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
            {imageUrl && <p style={{ fontSize: '0.85rem', color: 'var(--accent-color)', marginTop: '0.35rem' }}>الصورة المرفوعة حالياً: {imageUrl.split('/').pop()}</p>}
          </div>

          <div className="form-group">
            <label>كلمات الترنيمة بالتفصيل</label>
            <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)} rows="8" className="form-control" placeholder="اكتب الكلمات مقسمة إلى مقاطع وقرار... (اختياري في حال تم رفع صورة)"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">حفظ</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.25rem' }}>
            <div style={{ width: '100%', maxWidth: '400px' }}>
              <input 
                type="text" 
                placeholder={isAr ? "🔍 ابحث عن ترنيمة بالاسم، الكلمات، أو التصنيف..." : "🔍 Search hymns by title, lyrics, or category..."} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="form-control"
                style={{ fontSize: '0.9rem', padding: '0.6rem 1rem' }}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>{isAr ? 'عنوان الترنيمة' : 'Hymn Title'}</th>
                  <th>{isAr ? 'التصنيف' : 'Category'}</th>
                  <th>{isAr ? 'صورة' : 'Image'}</th>
                  <th>{isAr ? 'فيديو' : 'Video'}</th>
                  <th>{isAr ? 'صوت' : 'Audio'}</th>
                  <th>{isAr ? 'العرض الحي' : 'Live Presentation'}</th>
                  <th>{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHymns.map((h) => (
                  <tr key={h._id} style={{ backgroundColor: activePresenterHymn?._id === h._id ? 'rgba(197, 168, 128, 0.08)' : 'transparent' }}>
                    <td><strong>{h.title}</strong></td>
                    <td>{h.category}</td>
                    <td>{h.imageUrl ? <span style={{ color: 'var(--success-color)' }}>{isAr ? 'نعم 🖼️' : 'Yes 🖼️'}</span> : <span style={{ color: 'var(--text-light)' }}>{isAr ? 'لا' : 'No'}</span>}</td>
                    <td>{h.videoUrl ? <span style={{ color: 'var(--success-color)' }}>{isAr ? 'نعم' : 'Yes'}</span> : <span style={{ color: 'var(--text-light)' }}>{isAr ? 'لا' : 'No'}</span>}</td>
                    <td>{h.audioUrl ? <span style={{ color: 'var(--success-color)' }}>{isAr ? 'نعم' : 'Yes'}</span> : <span style={{ color: 'var(--text-light)' }}>{isAr ? 'لا' : 'No'}</span>}</td>
                    <td>
                      <button 
                        className="btn" 
                        style={{ 
                          padding: '0.35rem 0.65rem', 
                          fontSize: '0.8rem', 
                          backgroundColor: activePresenterHymn?._id === h._id ? 'var(--success-color)' : 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }} 
                        onClick={() => handlePresent(h)}
                      >
                        {activePresenterHymn?._id === h._id ? (isAr ? 'معروض 📺' : 'Active 📺') : (isAr ? 'عرض 📺' : 'Present 📺')}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => handleEdit(h)}><Edit2 size={14} /></button>
                        <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(h._id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

/* =========================================================================
   TAB: Gallery
   ========================================================================= */
const GalleryTab = ({ token }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGallery = () => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        if (data.success) setItems(data.data);
      });
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleCancel = () => {
    setTitle('');
    setType('image');
    setUrl('');
    setCategory('');
    setYear(new Date().getFullYear().toString());
    setFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    formData.append('url', url);
    formData.append('category', category);
    formData.append('year', year);

    if (file) {
      formData.append('galleryFile', file);
    }

    fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        setLoading(false);
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || (isAr ? 'فشلت عملية إضافة الوسيط.' : 'Failed to add media.')); });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess('تم إضافة العنصر الجديد إلى المعرض بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchGallery();
          handleCancel();
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء رفع الملف.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف هذا العنصر من المعرض نهائياً؟')) {
      fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حذف الملف.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف العنصر من المعرض بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchGallery();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>إدارة معرض الصور والفيديو</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>إضافة وسيط جديد</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>إضافة صورة أو فيديو إلى المعرض</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>عنوان الوسيط / المناسبة</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>النوع</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="form-control">
                <option value="image">صورة</option>
                <option value="video">فيديو يوتيوب</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>النشاط / التصنيف الكنسي</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="مثال: المخيم الصيفي" required className="form-control" />
            </div>

            <div className="form-group">
              <label>السنة</label>
              <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required className="form-control" />
            </div>
          </div>

          {type === 'video' ? (
            <div className="form-group">
              <label>رابط فيديو يوتيوب (URL)</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} required placeholder="https://youtube.com/watch?v=..." className="form-control" />
            </div>
          ) : (
            <div className="form-group">
              <label>رفع ملف الصورة</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                required={!url}
                className="form-control" 
                accept="image/*"
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري رفع الملف وحفظ البيانات...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>العنوان</th>
                <th>النوع</th>
                <th>المناسبة / النشاط</th>
                <th>السنة</th>
                <th>عرض الرابط</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.type === 'image' ? 'صورة' : 'فيديو'}</td>
                  <td>{item.category}</td>
                  <td>{item.year}</td>
                  <td>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                      معاينة
                    </a>
                  </td>
                  <td>
                    <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(item._id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   TAB: Prayer Requests
   ========================================================================= */
const PrayersTab = ({ token }) => {
  const [prayers, setPrayers] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchPrayers = () => {
    fetch('/api/prayers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPrayers(data.data);
      });
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handleMarkAsRead = (id) => {
    setSuccess('');
    setError('');
    fetch(`/api/prayers/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'فشلت عملية تحديث طلبة الصلاة.'); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSuccess('تم تعليم طلبة الصلاة كـ مقروءة بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchPrayers();
        }
      })
      .catch(err => {
        setError(err.message || 'حدث خطأ أثناء تحديث الحالة.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف طلبة الصلاة هذه؟')) {
      fetch(`/api/prayers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حذف طلبة الصلاة.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف طلبة الصلاة بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchPrayers();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>طلبات الصلاة الواردة من الزوار</h2>
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>المرسل</th>
              <th>رقم الهاتف</th>
              <th>الطلبة</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {prayers.map((p) => (
              <tr key={p._id} style={!p.isRead ? { backgroundColor: 'rgba(197, 168, 128, 0.05)', fontWeight: 'bold' } : {}}>
                <td>{new Date(p.createdAt).toLocaleString('ar-LB')}</td>
                <td>{p.name}</td>
                <td dir="ltr" style={{ textAlign: 'right' }}>{p.phone || 'غير مزود'}</td>
                <td style={{ maxWidth: '350px', whiteSpace: 'pre-wrap' }}>{p.request}</td>
                <td>{!p.isRead ? <span style={{ color: 'var(--warning-color)' }}>جديد</span> : <span style={{ color: 'var(--text-light)' }}>تمت القراءة</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!p.isRead && (
                      <button className="admin-btn-action" onClick={() => handleMarkAsRead(p._id)} title="تعليم كـ مقروء">
                        <Check size={14} />
                      </button>
                    )}
                    <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(p._id)} title="حذف">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   TAB: Settings
   ========================================================================= */
const SettingsTab = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  // Settings Form State
  const [churchName, setChurchName] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');
  const [beliefs, setBeliefs] = useState('');
  const [history, setHistory] = useState('');
  const [pastorsInfo, setPastorsInfo] = useState('');
  const [verseText, setVerseText] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhones, setContactPhones] = useState('');
  const [address, setAddress] = useState('');
  const [addressMapUrl, setAddressMapUrl] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  
  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);
  const [backupFile, setBackupFile] = useState(null);

  const handleDownloadBackup = () => {
    setLoading(true);
    fetch('/api/settings/backup', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('فشل تنزيل النسخة الاحتياطية.');
        return res.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `church_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setLoading(false);
        setSuccess('تم تنزيل النسخة الاحتياطية بنجاح!');
        setTimeout(() => setSuccess(''), 4000);
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء تنزيل النسخة الاحتياطية.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBackupFile(e.target.files[0]);
    }
  };

  const handleRestoreBackup = () => {
    if (!backupFile) return;

    const confirmRestore = window.confirm(
      'تحذير هام جداً:\nعملية استعادة النسخة الاحتياطية ستقوم بحذف جميع البيانات والملفات الحالية في قاعدة البيانات واستبدالها بالكامل ببيانات الملف المرفوع.\n\nهل أنت متأكد تماماً من رغبتك في المتابعة واستبدال البيانات؟'
    );

    if (!confirmRestore) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        
        fetch('/api/settings/restore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(jsonData)
        })
          .then(res => res.json())
          .then(data => {
            setLoading(false);
            if (data.success) {
              setSuccess('تم استعادة البيانات والنسخة الاحتياطية بنجاح! سيتم تحديث الصفحة لتطبيق التغييرات.');
              setBackupFile(null);
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else {
              throw new Error(data.message || 'فشلت استعادة النسخة الاحتياطية.');
            }
          })
          .catch(err => {
            setLoading(false);
            setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم لاستعادة البيانات.');
            setTimeout(() => setError(''), 5000);
          });
      } catch (err) {
        setLoading(false);
        setError('الملف المختار غير صالح أو ليس بتنسيق JSON صحيح.');
        setTimeout(() => setError(''), 5000);
      }
    };
    reader.readAsText(backupFile);
  };

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const s = data.data;
          setChurchName(s.churchName || '');
          setWelcomeMessage(s.welcomeMessage || '');
          setVision(s.vision || '');
          setMission(s.mission || '');
          setBeliefs(s.beliefs || '');
          setHistory(s.history || '');
          setPastorsInfo(s.pastorsInfo || '');
          setVerseText(s.verseText || '');
          setVerseReference(s.verseReference || '');
          setContactEmail(s.contactEmail || '');
          setContactPhones(s.contactPhones ? s.contactPhones.join(', ') : '');
          setAddress(s.address || '');
          setAddressMapUrl(s.addressMapUrl || '');
          setFacebookUrl(s.facebookUrl || '');
          setYoutubeUrl(s.youtubeUrl || '');
          setWhatsappUrl(s.whatsappUrl || '');
          setInstagramUrl(s.instagramUrl || '');
          setTiktokUrl(s.tiktokUrl || '');
        }
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('churchName', churchName);
    formData.append('welcomeMessage', welcomeMessage);
    formData.append('vision', vision);
    formData.append('mission', mission);
    formData.append('beliefs', beliefs);
    formData.append('history', history);
    formData.append('pastorsInfo', pastorsInfo);
    formData.append('verseText', verseText);
    formData.append('verseReference', verseReference);
    formData.append('contactEmail', contactEmail);
    formData.append('address', address);
    formData.append('addressMapUrl', addressMapUrl);
    formData.append('facebookUrl', facebookUrl);
    formData.append('youtubeUrl', youtubeUrl);
    formData.append('whatsappUrl', whatsappUrl);
    formData.append('instagramUrl', instagramUrl);
    formData.append('tiktokUrl', tiktokUrl);
  
    // Split phone numbers comma-separated
    const phonesArr = contactPhones.split(',').map(p => p.trim()).filter(Boolean);
    formData.append('contactPhones', JSON.stringify(phonesArr));

    if (logoFile) formData.append('logo', logoFile);
    if (heroFile) formData.append('heroImage', heroFile);

    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.message || 'فشلت عملية حفظ إعدادات الموقع العام.');
          });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess('تم حفظ إعدادات الموقع العام وتحديث الهوية البصرية بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
        } else {
          setError(data.message || 'حدث خطأ غير معروف أثناء حفظ الإعدادات.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(err.message || 'حدث خطأ في الاتصال بالشبكة. يرجى المحاولة بعد قليل.');
      });
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{isAr ? 'إعدادات الموقع العام والهوية البصرية' : 'General Site & Visual Identity Settings'}</h2>
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label>اسم الكنيسة</label>
            <input type="text" value={churchName} onChange={(e) => setChurchName(e.target.value)} required className="form-control" />
          </div>

          <div className="form-group">
            <label>أرقام الهواتف (مفصولة بفاصلة)</label>
            <input type="text" value={contactPhones} onChange={(e) => setContactPhones(e.target.value)} placeholder="+961 70 000000, +961 08 000000" className="form-control" />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>تحديث شعار الكنيسة (صورة Logo)</label>
            <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} className="form-control" accept="image/*" />
          </div>

          <div className="form-group">
            <label>تحديث صورة الغلاف للرئيسية (Hero Image)</label>
            <input type="file" onChange={(e) => setHeroFile(e.target.files[0])} className="form-control" accept="image/*" />
          </div>
        </div>

        <div className="form-group">
          <label>الرسالة الترحيبية (الصفحة الرئيسية)</label>
          <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} rows="3" className="form-control"></textarea>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>الرؤية</label>
            <textarea value={vision} onChange={(e) => setVision(e.target.value)} rows="4" className="form-control"></textarea>
          </div>

          <div className="form-group">
            <label>الرسالة</label>
            <textarea value={mission} onChange={(e) => setMission(e.target.value)} rows="4" className="form-control"></textarea>
          </div>
        </div>

        <div className="form-group">
          <label>القيم والعقيدة</label>
          <textarea value={beliefs} onChange={(e) => setBeliefs(e.target.value)} rows="5" className="form-control"></textarea>
        </div>

        <div className="form-group">
          <label>تاريخ الكنيسة (صفحة من نحن)</label>
          <textarea value={history} onChange={(e) => setHistory(e.target.value)} rows="4" className="form-control"></textarea>
        </div>

        <div className="form-group">
          <label>الخدام والرعاة (التعريف بالخدام والقس)</label>
          <textarea value={pastorsInfo} onChange={(e) => setPastorsInfo(e.target.value)} rows="3" className="form-control"></textarea>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>آية اليوم (نص الآية)</label>
            <input type="text" value={verseText} onChange={(e) => setVerseText(e.target.value)} className="form-control" />
          </div>

          <div className="form-group">
            <label>شاهد الآية المرجعي</label>
            <input type="text" value={verseReference} onChange={(e) => setVerseReference(e.target.value)} className="form-control" placeholder="مثال: يشوع 24: 15" />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>البريد الإلكتروني للتواصل</label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="form-control" />
          </div>

          <div className="form-group">
            <label>العنوان الجغرافي المكتوب</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" />
          </div>
        </div>

        <div className="form-group">
          <label>رابط خارطة جوجل (Google Maps Embed Link - src tag ONLY)</label>
          <input type="text" value={addressMapUrl} onChange={(e) => setAddressMapUrl(e.target.value)} className="form-control" placeholder="https://www.google.com/maps/embed?pb=..." />
        </div>

        <div className="grid-3">
          <div className="form-group">
            <label>رابط فيسبوك</label>
            <input type="text" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} className="form-control" />
          </div>

          <div className="form-group">
            <label>رابط يوتيوب</label>
            <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="form-control" />
          </div>

          <div className="form-group">
            <label>رابط واتساب للمحادثة</label>
            <input type="text" value={whatsappUrl} onChange={(e) => setWhatsappUrl(e.target.value)} className="form-control" placeholder="https://wa.me/..." />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>رابط انستجرام (Instagram)</label>
            <input type="text" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} className="form-control" placeholder="https://instagram.com/..." />
          </div>

          <div className="form-group">
            <label>رابط تيك توك (TikTok)</label>
            <input type="text" value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} className="form-control" placeholder="https://tiktok.com/@..." />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
          {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات بالكامل'}
        </button>
      </form>

      {/* Backup and Restore Section */}
      <div className="glass-card" style={{ marginTop: '2.5rem', borderTop: '4px solid var(--accent-color)', padding: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', margin: '0 0 0.5rem 0' }}>
          <Database size={20} />
          <span>النسخ الاحتياطي واستعادة البيانات</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>
          يمكنك تنزيل نسخة احتياطية كاملة بصيغة JSON تحتوي على جميع بيانات الموقع (الإعدادات، الترانيم، العظات، الأعضاء، الاجتماعات، والأخبار) والاحتفاظ بها بأمان، أو استخدامها لاستعادة بيانات الموقع بالكامل في حال حدوث أي خلل.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          {/* Export Button */}
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleDownloadBackup}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}
          >
            <Download size={16} />
            <span>تنزيل نسخة احتياطية (.json)</span>
          </button>

          {/* Import File Input & Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="file" 
              accept=".json" 
              id="backup-file-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label 
              htmlFor="backup-file-input" 
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0 }}
            >
              <Upload size={16} />
              <span>{backupFile ? backupFile.name : 'اختر ملف نسخة احتياطية لاستعادتها'}</span>
            </label>

            {backupFile && (
              <button 
                type="button" 
                className="btn btn-accent" 
                onClick={handleRestoreBackup}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}
              >
                <span>استعادة البيانات الآن 📤</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   TAB: Admin Users Management (Super-admin access only)
   ========================================================================= */
const UsersTab = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');
  const [canManageExpenses, setCanManageExpenses] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Editing states
  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('editor');
  const [editCanManageExpenses, setEditCanManageExpenses] = useState(false);

  const fetchUsers = () => {
    fetch('/api/auth/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditUsername(u.username);
    setEditEmail(u.email);
    setEditPassword('');
    setEditRole(u.role);
    setEditCanManageExpenses(!!u.canManageExpenses);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    const payload = {
      username: editUsername,
      email: editEmail,
      role: editRole,
      canManageExpenses: editCanManageExpenses
    };
    if (editPassword) {
      payload.password = editPassword;
    }

    fetch(`/api/auth/users/${editingUser._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess('تم تحديث حساب المسؤول بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          setEditingUser(null);
          fetchUsers();
        } else {
          setError(data.message || 'فشلت عملية تحديث الحساب.');
          setTimeout(() => setError(''), 4000);
        }
      })
      .catch(err => {
        console.error(err);
        setError('حدث خطأ في الاتصال بالخادم.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleCancel = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('editor');
    setCanManageExpenses(false);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ username, email, password, role, canManageExpenses })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'فشلت عملية تسجيل حساب المسؤول.'); });
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setSuccess('تم تسجيل حساب المسؤول الجديد بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchUsers();
          handleCancel();
        }
      })
      .catch(err => {
        setError(err.message || 'حدث خطأ أثناء تسجيل المسؤول.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleUpdateUser = (id, updatedRole, updatedExpenses) => {
    setSuccess('');
    setError('');

    fetch(`/api/auth/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: updatedRole, canManageExpenses: updatedExpenses })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSuccess('تم تحديث صلاحيات الخادم بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchUsers();
        } else {
          setError(data.message || 'فشل تحديث الصلاحيات.');
          setTimeout(() => setError(''), 4000);
        }
      })
      .catch(err => {
        console.error(err);
        setError('خطأ في الاتصال بالخادم.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من سحب صلاحيات وحذف هذا الحساب الإداري؟')) {
      fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حذف الحساب.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف حساب المسؤول بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchUsers();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{isAr ? 'إدارة حسابات المدراء والمحررين' : 'Admin & Editor Account Management'}</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>{isAr ? 'إضافة مدير جديد' : 'Add New Admin / Editor'}</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>تسجيل حساب مسؤول جديد</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>اسم المستخدم</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>كلمة المرور</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" placeholder="حد أدنى 6 خانات" />
            </div>

            <div className="form-group">
              <label>الدور والصلاحيات</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
                <option value="editor">محرر (تحديث المحتوى فقط)</option>
                <option value="admin">مدير كامل (إدارة المستخدمين والإعدادات العامة)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input 
              type="checkbox" 
              id="canManageExpenses" 
              checked={canManageExpenses} 
              onChange={(e) => setCanManageExpenses(e.target.checked)} 
              style={{ width: 'auto', transform: 'scale(1.2)' }}
            />
            <label htmlFor="canManageExpenses" style={{ cursor: 'pointer', margin: 0, fontWeight: 'bold' }}>إعطاء صلاحية «إدارة المصاريف الكنسية» 💰</label>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary">تسجيل الحساب</button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>تاريخ الإنشاء</th>
                <th>اسم المستخدم</th>
                <th>البريد الإلكتروني</th>
                <th>الصلاحيات</th>
                <th>إدارة المصاريف</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{new Date(u.createdAt).toLocaleDateString('ar-LB')}</td>
                  <td><strong>{u.username}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      value={u.role} 
                      onChange={(e) => handleUpdateUser(u._id, e.target.value, u.canManageExpenses)}
                      className="form-control"
                      style={{ width: 'auto', display: 'inline-block', fontSize: '0.85rem', padding: '0.2rem 0.5rem', height: 'auto' }}
                    >
                      <option value="editor">محرر</option>
                      <option value="admin">مدير كامل</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={u.canManageExpenses || false} 
                      onChange={(e) => handleUpdateUser(u._id, u.role, e.target.checked)}
                      style={{ cursor: 'pointer', transform: 'scale(1.1)' }}
                      title="تعديل صلاحية إدارة المصاريف"
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn-action" onClick={() => openEditModal(u)} title="تعديل حساب المسؤول">
                        <Edit2 size={14} />
                      </button>
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(u._id)} title="حذف">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(8px)',
          overflowY: 'auto',
          padding: '2rem 1rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '1.5rem 1.75rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-primary, #ffffff)',
            color: 'var(--text-primary, #1e293b)',
            position: 'relative',
            marginTop: 'auto',
            marginBottom: 'auto'
          }}>
            <button 
              onClick={() => setEditingUser(null)} 
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.1rem',
                cursor: 'pointer',
                color: 'var(--text-light)',
                transition: 'color 0.2s'
              }}
              title="إغلاق"
              onMouseEnter={(e) => e.target.style.color = 'var(--error-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-light)'}
            >
              ✕
            </button>

            <h3 style={{ color: 'var(--text-primary, #1e293b)', fontWeight: '700', marginBottom: '0.15rem', fontSize: '1.25rem' }}>
              تعديل حساب الخادم 📝
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
              تعديل صلاحيات الوصول الخاصة بـ <strong>{editingUser.username}</strong>
            </p>
            <hr style={{ margin: '0 0 1rem 0', borderColor: 'var(--border-color)' }} />
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* Row 1: Username & Email */}
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-primary, #1e293b)', fontWeight: '600', fontSize: '0.85rem' }}>اسم المستخدم</label>
                  <input 
                    type="text" 
                    value={editUsername} 
                    onChange={(e) => setEditUsername(e.target.value)} 
                    required 
                    className="form-control" 
                    style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border-color)', width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                  />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-primary, #1e293b)', fontWeight: '600', fontSize: '0.85rem' }}>البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)} 
                    required 
                    className="form-control" 
                    style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border-color)', width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Row 2: Password & Role */}
              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-primary, #1e293b)', fontWeight: '600', fontSize: '0.85rem' }}>كلمة مرور جديدة</label>
                  <input 
                    type="password" 
                    value={editPassword} 
                    onChange={(e) => setEditPassword(e.target.value)} 
                    className="form-control" 
                    placeholder="اتركها فارغة لعدم التغيير" 
                    style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border-color)', width: '100%', padding: '0.6rem 0.85rem', fontSize: '0.9rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: 'var(--text-primary, #1e293b)', fontWeight: '600', fontSize: '0.85rem' }}>الدور والصلاحيات</label>
                  <select 
                    value={editRole} 
                    onChange={(e) => setEditRole(e.target.value)} 
                    className="form-control"
                    style={{ backgroundColor: 'var(--bg-secondary, #f8fafc)', color: 'var(--text-primary, #1e293b)', border: '1px solid var(--border-color)', height: 'auto', padding: '0.55rem 0.75rem', width: '100%', fontSize: '0.88rem' }}
                  >
                    <option value="editor">محرر (محتوى فقط)</option>
                    <option value="admin">مدير كامل</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Expenses Permission */}
              <div className="form-group" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '0.7rem 1rem',
                borderRadius: '8px',
                border: '1px dashed var(--border-color)',
                marginTop: '0.25rem',
                marginBottom: 0
              }}>
                <input 
                  type="checkbox" 
                  id="editCanManageExpenses" 
                  checked={editCanManageExpenses} 
                  onChange={(e) => setEditCanManageExpenses(e.target.checked)}
                  style={{ width: 'auto', transform: 'scale(1.15)', cursor: 'pointer', margin: 0 }}
                />
                <label htmlFor="editCanManageExpenses" style={{ cursor: 'pointer', margin: 0, fontWeight: 'bold', color: 'var(--text-primary, #1e293b)', fontSize: '0.82rem' }}>
                  تفعيل صلاحية «إدارة المصاريف الكنسية» 💰
                </label>
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '110px', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>حفظ التغييرات</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditingUser(null)} style={{ minWidth: '70px', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics & Statistics Dashboard Tab
const AnalyticsTab = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    fetch('/api/analytics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  const arabicMonths = [
    'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
    'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'
  ];

  const getMonthName = (mNum) => {
    return arabicMonths[mNum - 1] || mNum;
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const totalPageViews = stats?.totalPageViews || 0;
  const totalLiveViews = stats?.totalLiveViews || 0;
  const liveRate = totalPageViews > 0 ? ((totalLiveViews / totalPageViews) * 100).toFixed(1) : 0;

  const monthlyData = {};
  
  if (stats?.monthlyViews) {
    stats.monthlyViews.forEach(v => {
      const key = `${v.year}-${v.month}`;
      if (!monthlyData[key]) monthlyData[key] = { year: v.year, month: v.month, pageViews: 0, liveViews: 0 };
      monthlyData[key].pageViews = v.count || 0;
    });
  }

  if (stats?.monthlyLiveViews) {
    stats.monthlyLiveViews.forEach(v => {
      const key = `${v.year}-${v.month}`;
      if (!monthlyData[key]) monthlyData[key] = { year: v.year, month: v.month, pageViews: 0, liveViews: 0 };
      monthlyData[key].liveViews = v.count || 0;
    });
  }

  const monthlyList = Object.values(monthlyData).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const maxPageViews = Math.max(...monthlyList.map(m => m.pageViews), 1);

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>{isAr ? 'لوحة إحصائيات وتحليلات الزوار' : 'Visitor Analytics & Statistics'}</h2>
        <p>{isAr ? 'تقارير دورية حول حركة زيارات الموقع، ومعدلات الدخول لمشاهدة البث المباشر.' : 'Periodic reports on site visit traffic and live stream view rates.'}</p>
      </div>

      <div className="grid-3 dashboard-stats-row">
        <div className="stat-card glass-card">
          <div className="stat-card-icon page-icon" style={{ backgroundColor: 'rgba(26, 54, 93, 0.05)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>👁️</div>
          <div className="stat-card-info" style={{ marginRight: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>إجمالي زيارات الموقع</h3>
            <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-color)' }}>{totalPageViews}</div>
            <p className="stat-desc" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>تصفحات الصفحات</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-icon live-icon" style={{ backgroundColor: 'rgba(197, 168, 128, 0.08)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>📺</div>
          <div className="stat-card-info" style={{ marginRight: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>مشاهدات البث المباشر</h3>
            <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--accent-color)' }}>{totalLiveViews}</div>
            <p className="stat-desc" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>الزوار الذين دخلوا البث</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-icon rate-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.08)', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>📈</div>
          <div className="stat-card-info" style={{ marginRight: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>نسبة المتابعة للبث</h3>
            <div className="stat-value" style={{ fontSize: '1.75rem', fontWeight: '800', color: '#4caf50' }}>{liveRate}%</div>
            <p className="stat-desc" style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>معدل اهتمام الجمهور بالبث</p>
          </div>
        </div>
      </div>

      <div className="analytics-chart-section glass-card" style={{ marginTop: '2rem', padding: '1.75rem' }}>
        <h3>المخطط البياني للزيارات الشهرية</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>مقارنة مرئية لحجم التصفح العام شهراً بشهر.</p>
        
        {monthlyList.length === 0 ? (
          <p className="no-data">لا توجد بيانات كافية لعرض المخطط بعد.</p>
        ) : (
          <div className="bar-chart-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {monthlyList.map((item, idx) => {
              const percentage = ((item.pageViews / maxPageViews) * 100).toFixed(0);
              return (
                <div key={idx} className="bar-chart-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div className="bar-label" style={{ width: '130px', fontWeight: '700', fontSize: '0.95rem' }}>
                    {getMonthName(item.month)} {item.year}
                  </div>
                  <div className="bar-track" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.05)', height: '24px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div className="bar-fill" style={{ width: `${percentage}%`, backgroundColor: 'var(--accent-color)', height: '100%', transition: 'width 0.8s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px', boxSizing: 'border-box' }}>
                      {item.pageViews > 0 && <span style={{ color: 'var(--primary-dark)', fontSize: '0.8rem', fontWeight: 'bold' }}>{item.pageViews}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="analytics-table-section glass-card" style={{ marginTop: '2rem', padding: '1.75rem' }}>
        <h3>جدول البيانات التفصيلي</h3>
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>الشهر والسنة</th>
                <th>إجمالي زيارات الموقع</th>
                <th>مشاهدي البث المباشر (نقرات)</th>
                <th>نسبة المتابعة</th>
              </tr>
            </thead>
            <tbody>
              {monthlyList.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>لا توجد بيانات مسجلة حتى الآن.</td>
                </tr>
              ) : (
                monthlyList.map((item, idx) => {
                  const rate = item.pageViews > 0 ? ((item.liveViews / item.pageViews) * 100).toFixed(1) : 0;
                  return (
                    <tr key={idx}>
                      <td><strong>{getMonthName(item.month)} {item.year}</strong></td>
                      <td>{item.pageViews} زيارة</td>
                      <td>{item.liveViews} نقرة</td>
                      <td>
                        <span className="hymn-cat-badge" style={{ backgroundColor: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Blocked Devices & Lockouts Management Tab
const LockoutsTab = ({ token }) => {
  const [lockouts, setLockouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const fetchLockouts = () => {
    setLoading(true);
    fetch('/api/auth/lockouts', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLockouts(data.data || []);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLockouts();
  }, [token]);

  const handleUnblock = (id) => {
    if (!window.confirm('هل أنت متأكد من فك حظر هذا الجهاز؟')) return;

    fetch(`/api/auth/lockouts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage('تم فك حظر الجهاز وتصفير محاولاته بنجاح!');
          fetchLockouts();
          setTimeout(() => setMessage(''), 3000);
        } else {
          alert('حدث خطأ أثناء إلغاء الحظر.');
        }
      })
      .catch(err => console.error(err));
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '300px' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>{isAr ? 'إدارة الأجهزة المحظورة وسجلات الأمان' : 'Blocked Devices & Security Logs'}</h2>
        <p>{isAr ? 'مراقبة وتعديل الأجهزة وعناوين الـ IP التي تم قفلها بسبب تكرار إدخال كلمات مرور خاطئة.' : 'Monitor and manage devices & IP addresses locked due to failed login attempts.'}</p>
      </div>

      {message && (
        <div className="admin-alert-success" style={{ margin: '1rem 0' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>آخر تحديث</th>
              <th>عنوان الـ IP</th>
              <th>بيانات المتصفح والجهاز</th>
              <th>المحاولات</th>
              <th>حالة الحظر</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lockouts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  لا توجد أجهزة محظورة أو تحت المراقبة حالياً. الموقع آمن تماماً!
                </td>
              </tr>
            ) : (
              lockouts.map((item) => {
                const isBlocked = item.lockoutUntil && new Date(item.lockoutUntil) > new Date();
                let remainingMinutes = 0;
                if (isBlocked) {
                  remainingMinutes = Math.ceil((new Date(item.lockoutUntil) - new Date()) / (60 * 1000));
                }

                return (
                  <tr key={item._id}>
                    <td>{new Date(item.updatedAt || item.createdAt).toLocaleString('ar-LB')}</td>
                    <td><code style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{item.ip}</code></td>
                    <td style={{ maxWidth: '280px', fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.userAgent}>
                      {item.userAgent}
                    </td>
                    <td><strong>{item.attempts} محاولات</strong></td>
                    <td>
                      {isBlocked ? (
                        <span className="hymn-cat-badge" style={{ backgroundColor: 'rgba(244, 67, 54, 0.15)', color: '#f44336', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          محظور حالياً (متبقي {remainingMinutes} دقيقة)
                        </span>
                      ) : (
                        <span className="hymn-cat-badge" style={{ backgroundColor: 'rgba(255, 152, 0, 0.15)', color: '#ff9800', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          تحت المراقبة ({item.attempts}/10)
                        </span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="admin-btn-action" 
                        onClick={() => handleUnblock(item._id)} 
                        title="إلغاء الحظر وتصفير المحاولات"
                        style={{ color: '#4caf50', border: '1px solid rgba(76, 175, 80, 0.3)', padding: '0.25rem 0.6rem', height: 'auto', fontSize: '0.8rem' }}
                      >
                        فك الحظر
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   TAB: AI Chatbot Settings
   ========================================================================= */
const ChatbotTab = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const [chatbotName, setChatbotName] = useState('');
  const [pastorPhoneNumber, setPastorPhoneNumber] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const s = data.data;
          setIsChatbotEnabled(s.isChatbotEnabled !== false);
          setChatbotName(s.chatbotName || 'المساعد الروحي للكنيسة');
          setPastorPhoneNumber(s.pastorPhoneNumber || '');
          setGeminiApiKey(s.geminiApiKey || '');
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('isChatbotEnabled', isChatbotEnabled);
    formData.append('chatbotName', chatbotName);
    formData.append('pastorPhoneNumber', pastorPhoneNumber);
    formData.append('geminiApiKey', geminiApiKey);

    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errData => {
            throw new Error(errData.message || 'فشلت عملية حفظ إعدادات المساعد الذكي.');
          });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess('تم تحديث إعدادات المساعد الروحي الذكي (AI Chatbot) بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
        } else {
          setError(data.message || 'حدث خطأ غير معروف أثناء حفظ الإعدادات.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError(err.message || 'حدث خطأ في الاتصال بالشبكة. يرجى المحاولة بعد قليل.');
      });
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-tab-header">
        <h2>{isAr ? 'إدارة المساعد الروحي الذكي (AI Chatbot)' : 'AI Spiritual Assistant Management'}</h2>
        <p>{isAr ? 'تخصيص المساعد الذكي المبني على الذكاء الاصطناعي (Gemini) الذي يجيب الزوار من الكتاب المقدس.' : 'Customize the AI Assistant (Gemini) that answers visitors using scripture.'}</p>
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="grid-2">
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
            <input 
              type="checkbox" 
              id="isChatbotEnabled"
              checked={isChatbotEnabled} 
              onChange={(e) => setIsChatbotEnabled(e.target.checked)} 
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="isChatbotEnabled" style={{ cursor: 'pointer', margin: 0, fontWeight: 'bold' }}>تفعيل المساعد الروحي في الموقع</label>
          </div>

          <div className="form-group">
            <label>اسم المساعد الذكي</label>
            <input 
              type="text" 
              value={chatbotName} 
              onChange={(e) => setChatbotName(e.target.value)} 
              placeholder="مثال: المساعد الروحي للكنيسة" 
              className="form-control"
              required
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>رقم هاتف القسيس (للاستفسارات الصعبة والمشورة الروحية)</label>
            <input 
              type="text" 
              value={pastorPhoneNumber} 
              onChange={(e) => setPastorPhoneNumber(e.target.value)} 
              placeholder="مثال: 96170123456+" 
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>مفتاح Gemini API Key (للتواصل مع ذكاء جوجل الاصطناعي)</label>
            <input 
              type="password" 
              value={geminiApiKey} 
              onChange={(e) => setGeminiApiKey(e.target.value)} 
              placeholder="أدخل مفتاح AI API Key الخاص بك" 
              className="form-control"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              يُسخدم هذا المفتاح للتواصل مع خدمة Google Gemini لتوليد الأجوبة.
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
          {loading ? 'جاري الحفظ...' : 'حفظ إعدادات المساعد الذكي'}
        </button>
      </form>
    </div>
  );
};

/* =========================================================================
   TAB: Articles & Studies
   ========================================================================= */
const ArticlesTab = ({ token }) => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('القس الراعي');
  const [category, setCategory] = useState('مقالات روحية');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const fetchArticles = () => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) setArticles(data.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleEdit = (art) => {
    setEditingId(art._id);
    setTitle(art.title);
    setAuthor(art.author || 'القس الراعي');
    setCategory(art.category || 'مقالات روحية');
    setContent(art.content);
    setImageFile(null);
    setPdfFile(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('القس الراعي');
    setCategory('مقالات روحية');
    setContent('');
    setImageFile(null);
    setPdfFile(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('category', category);

    if (imageFile) formData.append('articleImage', imageFile);
    if (pdfFile) formData.append('articlePdf', pdfFile);

    const endpoint = editingId ? `/api/articles/${editingId}` : '/api/articles';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حفظ المقالة الروحية.'); });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess(editingId ? 'تم تعديل المقالة بنجاح!' : 'تم إضافة المقالة بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchArticles();
          handleCancel();
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء حفظ المقالة الروحية.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف هذه المقالة الروحية؟')) {
      fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية الحذف.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف المقالة بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchArticles();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>إدارة الدراسات والمقالات الروحية</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>كتابة مقال جديد</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'تعديل مقالة روحية' : 'كتابة مقالة روحية جديدة'}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="grid-2">
            <div className="form-group">
              <label>عنوان المقال</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" />
            </div>

            <div className="form-group">
              <label>الكاتب / المنسوب له</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="form-control" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>التصنيف الروحي</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                <option value="دراسات كتابية">دراسة كتابية</option>
                <option value="تأملات روحية">تأمل روحي</option>
                <option value="الأسرة المسيحية">الأسرة المسيحية</option>
                <option value="مقالات روحية">مقال روحي عام</option>
              </select>
            </div>

            <div className="form-group">
              <label>صورة الغلاف (اختياري)</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="form-control" accept="image/*" />
            </div>
          </div>

          <div className="form-group">
            <label>ملف دراسة كتابية PDF مرفق (اختياري)</label>
            <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} className="form-control" accept="application/pdf" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>تتيح هذه الحقل للزوار تنزيل المقال كدراسة منسقة بصيغة PDF.</span>
          </div>

          <div className="form-group">
            <label>محتوى المقالة بالكامل</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows="10" className="form-control" placeholder="اكتب تأملك أو دراستك هنا..."></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ والرفع...' : 'حفظ ونشر المقال'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>تاريخ النشر</th>
                <th>العنوان</th>
                <th>الكاتب</th>
                <th>التصنيف</th>
                <th>وقت القراءة</th>
                <th>ملف PDF</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((art) => (
                <tr key={art._id}>
                  <td>{new Date(art.createdAt).toLocaleDateString('ar-LB')}</td>
                  <td><strong>{art.title}</strong></td>
                  <td>{art.author}</td>
                  <td>{art.category}</td>
                  <td>{art.readTime} د</td>
                  <td>{art.pdfUrl ? <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>نعم</span> : <span style={{ color: 'var(--text-light)' }}>لا</span>}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="admin-btn-action" onClick={() => handleEdit(art)}><Edit2 size={14} /></button>
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(art._id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Counseling Request Management Tab (Confidential to Pastor/Admin only)
const CounselingTab = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchRequests = () => {
    setLoading(true);
    fetch('/api/counseling', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setRequests(data.data);
        } else {
          showAlert(data.message || 'فشل في تحميل طلبات المشورة.', 'error');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleMarkAsRead = (id) => {
    fetch(`/api/counseling/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showAlert('تم وضع علامة مقروء على الطلب بنجاح.');
          fetchRequests();
          if (selectedRequest && selectedRequest._id === id) {
            setSelectedRequest(prev => ({ ...prev, isRead: true }));
          }
        } else {
          showAlert(data.message || 'فشل في تعديل حالة الطلب.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف طلب المشورة هذا نهائياً؟')) return;

    fetch(`/api/counseling/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showAlert('تم حذف طلب المشورة بنجاح.');
          fetchRequests();
          if (selectedRequest && selectedRequest._id === id) {
            setSelectedRequest(null);
          }
        } else {
          showAlert(data.message || 'فشل في حذف طلب المشورة.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  const getContactText = (method) => {
    switch (method) {
      case 'whatsapp': return 'واتساب (WhatsApp)';
      case 'meeting': return 'مقابلة شخصية بكنيسة قنافار';
      default: return 'اتصال هاتفي مباشر';
    }
  };

  return (
    <div className="tab-pane">
      <div className="tab-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{isAr ? 'طلبات الإرشاد الرعوي والمشورة الخاصة 🕊️' : 'Pastoral Care & Counseling Requests 🕊️'}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {isAr ? 'طلبات سرية للغاية ومقيدة لراعي الكنيسة فقط لإرشاد العائلات وحفظ أسرارهم الروحية والشخصية.' : 'Strictly confidential requests restricted to the pastor for family guidance and spiritual care.'}
          </p>
        </div>
      </div>

      {alert.show && (
        <div className={`alert-toast ${alert.type}`} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '8px', background: alert.type === 'success' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)', color: alert.type === 'success' ? '#4caf50' : '#f44336', border: `1px solid ${alert.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}` }}>
          {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>جارٍ تحميل الطلبات...</p>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <HeartHandshake size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <p>لا توجد طلبات إرشاد أو مشورة حالياً.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>تاريخ الطلب</th>
                <th>الاسم</th>
                <th>رقم الهاتف</th>
                <th>وسيلة التواصل</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} style={{ fontWeight: !req.isRead ? 'bold' : 'normal', background: !req.isRead ? 'rgba(197, 168, 128, 0.05)' : 'transparent' }}>
                  <td>{new Date(req.createdAt).toLocaleDateString('ar-LB')}</td>
                  <td>{req.name}</td>
                  <td dir="ltr" style={{ textAlign: 'right' }}>{req.phone}</td>
                  <td>{getContactText(req.preferredContact)}</td>
                  <td>
                    {req.isRead ? (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>مقروء</span>
                    ) : (
                      <span style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 'bold' }}>جديد 🌟</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-outline sm-btn" onClick={() => setSelectedRequest(req)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>عرض التفاصيل</button>
                      {!req.isRead && (
                        <button className="admin-btn-action" onClick={() => handleMarkAsRead(req._id)} title="تمييز كمقروء"><Check size={14} /></button>
                      )}
                      <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(req._id)} title="حذف"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <div className="book-modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="book-modal glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div className="book-modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3>تفاصيل طلب الإرشاد والمشورة السرّي 🕊️</h3>
              <button className="book-modal-close" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(197, 168, 128, 0.1)', padding: '0.75rem 1rem', borderRadius: '8px', borderRight: '4px solid var(--accent-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                🔒 <strong>تنبيه سرية:</strong> هذا المحتوى سري وموجه لك كراعٍ كنسي فقط.
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>اسم المرسل:</strong>
                  <p style={{ marginTop: '0.25rem' }}>{selectedRequest.name}</p>
                </div>
                <div>
                  <strong>تاريخ الإرسال:</strong>
                  <p style={{ marginTop: '0.25rem' }}>{new Date(selectedRequest.createdAt).toLocaleString('ar-LB')}</p>
                </div>
              </div>

              <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <strong>رقم الهاتف الجوال:</strong>
                  <p style={{ marginTop: '0.25rem' }} dir="ltr">{selectedRequest.phone}</p>
                </div>
                <div>
                  <strong>البريد الإلكتروني:</strong>
                  <p style={{ marginTop: '0.25rem' }}>{selectedRequest.email || 'غير متوفر'}</p>
                </div>
              </div>

              <div>
                <strong>وسيلة التواصل المفضلة:</strong>
                <p style={{ marginTop: '0.25rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{getContactText(selectedRequest.preferredContact)}</p>
              </div>

              <div>
                <strong>الموضوع / تفاصيل طلب المشورة:</strong>
                <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', lineHeight: '1.6' }}>
                  {selectedRequest.details}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                {!selectedRequest.isRead && (
                  <button className="btn btn-primary" onClick={() => handleMarkAsRead(selectedRequest._id)}>تمييز كمقروء</button>
                )}
                <button className="btn btn-outline" onClick={() => setSelectedRequest(null)}>إغلاق</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Church Expenses Management Tab
const ExpensesTab = ({ token }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchExpenses = () => {
    setLoading(true);
    fetch('/api/expenses', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          setExpenses(data.data);
        } else {
          showAlert(data.message || 'فشل في تحميل المصاريف الكنسية.', 'error');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const handleCancel = () => {
    setTitle('');
    setAmount('');
    setCategory('other');
    setDate(new Date().toISOString().substring(0, 10));
    setDescription('');
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      showAlert('يرجى ملء الحقول المطلوبة.', 'error');
      return;
    }

    setLoading(true);
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, amount: Number(amount), category, date, description })
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.success) {
          showAlert('تم إضافة المصروف الكنسي بنجاح!');
          fetchExpenses();
          handleCancel();
        } else {
          showAlert(data.message || 'فشلت عملية إضافة المصروف.', 'error');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المصروف نهائياً من القيود الكنسية؟')) return;

    fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showAlert('تم حذف قيد المصروف بنجاح.');
          fetchExpenses();
        } else {
          showAlert(data.message || 'فشل حذف المصروف.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        showAlert('خطأ في الاتصال بالخادم.', 'error');
      });
  };

  const getCategoryText = (cat) => {
    switch (cat) {
      case 'maintenance': return 'صيانة وترميم 🛠️';
      case 'charity': return 'مساعدات ورحمة 🕊️';
      case 'utilities': return 'فواتير وخدمات عامة 🔌';
      case 'ministries': return 'خدمات روحية ونشاطات 📖';
      default: return 'مصاريف أخرى 📝';
    }
  };

  // Compute total expenses
  const totalAmount = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div className="tab-pane">
      <div className="tab-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>{isAr ? 'إدارة السجلات المالية والمصاريف الكنسية 💰' : 'Financial Records & Church Expenses 💰'}</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
            {isAr ? 'قسم خاص بالمدراء والمحاسبين المعتمدين لتوثيق المصاريف المالية بكل دقة وأمانة.' : 'Restricted to authorized admins and accountants for recording church expenses.'}
          </p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} />
            <span>{isAr ? 'تسجيل مصروف جديد' : 'Record New Expense'}</span>
          </button>
        )}
      </div>

      {alert.show && (
        <div className={`alert-toast ${alert.type}`} style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '8px', background: alert.type === 'success' ? 'rgba(76, 175, 80, 0.15)' : 'rgba(244, 67, 54, 0.15)', color: alert.type === 'success' ? '#4caf50' : '#f44336', border: `1px solid ${alert.type === 'success' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}` }}>
          {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Summary box */}
      {!showForm && (
        <div className="analytics-overview" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="stat-card glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRight: '5px solid var(--accent-color)', borderLeft: '0' }}>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 'bold' }}>إجمالي المصاريف الكنسية المسجلة</p>
              <h3 style={{ fontSize: '2rem', color: 'var(--accent-color)', marginTop: '0.5rem', fontWeight: '800' }}>
                {totalAmount.toLocaleString('en-US')} ل.ل.
              </h3>
            </div>
            <span style={{ fontSize: '2.5rem' }}>💵</span>
          </div>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3>تسجيل قيد مصروف جديد</h3>
          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>بيان المصروف / الغرض (مطلوب)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="form-control" placeholder="مثال: فاتورة المولد الكهربائي لشهر تموز" />
            </div>
            <div className="form-group">
              <label>المبلغ الإجمالي بالليرة اللبنانية (مطلوب)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className="form-control" placeholder="المبلغ" min="0" />
            </div>
          </div>

          <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>التصنيف المالي</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control">
                <option value="utilities">فواتير وخدمات عامة 🔌</option>
                <option value="maintenance">صيانة وترميم 🛠️</option>
                <option value="charity">مساعدات ورحمة 🕊️</option>
                <option value="ministries">خدمات روحية ونشاطات 📖</option>
                <option value="other">مصاريف أخرى 📝</option>
              </select>
            </div>
            <div className="form-group">
              <label>تاريخ الصرف</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="form-control" />
            </div>
          </div>

          <div className="form-group">
            <label>ملاحظات / تفاصيل إضافية (اختياري)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" placeholder="اكتب أي ملاحظات تخص طريقة الدفع أو المستفيد..." rows="4"></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'تسجيل وحفظ القيد'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>جارٍ تحميل القيود المالية...</p>
        </div>
      ) : expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💵</span>
          <p>لا توجد مصاريف مسجلة حالياً.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>التاريخ</th>
                <th>بيان المصروف</th>
                <th>التصنيف</th>
                <th>المبلغ المسجل</th>
                <th>التفاصيل</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp._id}>
                  <td>{new Date(exp.date).toLocaleDateString('ar-LB')}</td>
                  <td><strong>{exp.title}</strong></td>
                  <td>{getCategoryText(exp.category)}</td>
                  <td style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                    {(exp.amount || 0).toLocaleString('en-US')} ل.ل.
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {exp.description || 'بلا ملاحظات'}
                    </span>
                  </td>
                  <td>
                    <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(exp._id)} title="حذف القيد المالي">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   TAB: Daily Verses
   ========================================================================= */
const DailyVersesTab = ({ token }) => {
  const [verses, setVerses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const isAr = language === 'ar';

  // Form State
  const [text, setText] = useState('');
  const [reference, setReference] = useState('');

  const fetchVerses = () => {
    fetch('/api/daily-verses', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setVerses(data.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchVerses();
  }, []);

  const handleEdit = (v) => {
    setEditingId(v._id);
    setText(v.text);
    setReference(v.reference);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setText('');
    setReference('');
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    const endpoint = editingId ? `/api/daily-verses/${editingId}` : '/api/daily-verses';
    const method = editingId ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text, reference })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'فشلت عملية حفظ الآية.'); });
        }
        return res.json();
      })
      .then(data => {
        setLoading(false);
        if (data.success) {
          setSuccess(editingId ? 'تم تعديل الآية بنجاح!' : 'تم إضافة الآية بنجاح!');
          setTimeout(() => setSuccess(''), 4000);
          fetchVerses();
          handleCancel();
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message || 'حدث خطأ أثناء حفظ الآية.');
        setTimeout(() => setError(''), 4000);
      });
  };

  const handleDelete = (id) => {
    setSuccess('');
    setError('');
    if (window.confirm('هل أنت متأكد من حذف هذه الآية الكنسية؟')) {
      fetch(`/api/daily-verses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(err => { throw new Error(err.message || 'فشلت عملية الحذف.'); });
          }
          return res.json();
        })
        .then(data => {
          if (data.success) {
            setSuccess('تم حذف الآية بنجاح!');
            setTimeout(() => setSuccess(''), 4000);
            fetchVerses();
          }
        })
        .catch(err => {
          setError(err.message || 'حدث خطأ أثناء الحذف.');
          setTimeout(() => setError(''), 4000);
        });
    }
  };

  return (
    <div>
      <div className="tab-header">
        <h2>{isAr ? 'إدارة آيات اليوم 📖' : 'Daily Verses Management 📖'}</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            <span>{isAr ? 'إضافة آية جديدة' : 'Add New Daily Verse'}</span>
          </button>
        )}
      </div>

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(76, 175, 80, 0.15)',
          color: '#4caf50',
          border: '1px solid rgba(76, 175, 80, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <CheckCircle size={20} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          backgroundColor: 'rgba(244, 67, 54, 0.15)',
          color: '#f44336',
          border: '1px solid rgba(244, 67, 54, 0.3)',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="glass-card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'تعديل الآية' : 'إضافة آية جديدة'}</h3>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-color)' }} />
          
          <div className="form-group">
            <label>نص الآية الكتابية</label>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required 
              rows="3" 
              className="form-control" 
              placeholder="اكتب نص الآية بالكامل هنا... مثال: «الرَّبُّ رَاعِيَّ فَلَا يُعْوِزُنِي شَيْءٌ.»"
            ></textarea>
          </div>

          <div className="form-group">
            <label>الشاهد / المرجع</label>
            <input 
              type="text" 
              value={reference} 
              onChange={(e) => setReference(e.target.value)} 
              required 
              className="form-control" 
              placeholder="مثال: مزمور 23: 1" 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button type="button" className="btn btn-outline" onClick={handleCancel}>إلغاء</button>
          </div>
        </form>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>نص الآية</th>
                <th>المرجع / الشاهد</th>
                <th>تاريخ الإضافة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {verses.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>لا توجد آيات مضافة حالياً. يرجى إضافة بعض الآيات.</td>
                </tr>
              ) : (
                verses.map((v) => (
                  <tr key={v._id}>
                    <td style={{ maxWidth: '400px', whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>{v.text}</td>
                    <td><span className="role-tag">{v.reference}</span></td>
                    <td>{new Date(v.createdAt).toLocaleDateString('ar-LB')}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="admin-btn-action" onClick={() => handleEdit(v)}><Edit2 size={14} /></button>
                        <button className="admin-btn-action admin-btn-delete" onClick={() => handleDelete(v._id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
