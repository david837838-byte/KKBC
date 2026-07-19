import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, LayoutDashboard, Radio } from 'lucide-react';
import Logo from './Logo';
import io from 'socket.io-client';

const Navbar = ({ isAdmin, setIsAdmin, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Fetch current live status
    fetch('/api/livestream')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setIsLive(data.data.isLive);
        }
      })
      .catch(err => console.error('Error fetching livestream status:', err));

    // Connect to Socket.io for real-time live updates
    const socket = io('/', { path: '/socket.io' }); // in dev proxied or root
    
    socket.on('liveStreamUpdate', (data) => {
      setIsLive(data.isLive);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/about' },
    { name: 'الاجتماعات', path: '/meetings' },
    { name: 'العظات', path: '/sermons' },
    { name: 'الترانيم', path: '/hymns' },
    { name: 'كتاب المقدس', path: '/bible' },
    { name: 'الدراسات والمقالات', path: '/articles' },
    { name: 'الأخبار', path: '/news' },
    { name: 'المعرض', path: '/gallery' },
    { name: 'طلبات الصلاة', path: '/prayer' },
    { name: 'تواصل معنا', path: '/contact' },
    { name: 'تنزيل التطبيق 📱', path: '/download' },
  ];

  return (
    <header className="glass-header">
      <nav className="nav-container">
        {/* Logo and Brand */}
        <Link to="/" onClick={() => setIsOpen(false)}>
          <Logo showText={true} />
        </Link>

        {/* Desktop Menu */}
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={isActive(link.path) ? 'nav-link active' : 'nav-link'}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Admin specific links */}
          {isAdmin && (
            <li>
              <Link
                to="/admin"
                className={isActive('/admin') ? 'nav-link admin-link active' : 'nav-link admin-link'}
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--accent-color)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <LayoutDashboard size={16} />
                لوحة التحكم
              </Link>
            </li>
          )}
        </ul>

        {/* Utility Actions (Theme toggle, Live indicator, Admin Logout, Mobile Menu toggle) */}
        <div className="nav-actions">
          {/* Live Indicator */}
          {isLive && (
            <Link to="/live" className="live-badge-nav">
              <Radio size={14} className="live-icon-blink" />
              <span>مباشر</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="action-btn" title="تغيير المظهر">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout if Admin */}
          {isAdmin && (
            <button onClick={handleLogout} className="action-btn logout-btn" title="تسجيل الخروج">
              <LogOut size={20} />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Embedded Styles to ensure beautiful navbar */}
      <style>{`
        .glass-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          gap: 1rem;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary-color);
          background: rgba(26, 54, 93, 0.05);
        }
        [data-theme="dark"] .nav-link:hover, [data-theme="dark"] .nav-link.active {
          color: var(--accent-color);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .action-btn {
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .action-btn:hover {
          background: var(--border-color);
        }
        .logout-btn {
          color: var(--error-color);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        .menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: var(--text-primary);
          cursor: pointer;
        }
        .live-badge-nav {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--error-color);
          color: white;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          animation: pulse 2s infinite;
        }
        .live-icon-blink {
          animation: blink 1.5s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 992px) {
          .menu-toggle {
            display: block;
          }
          .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            flex-direction: column;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            padding: 1.5rem;
            gap: 1rem;
            display: none;
            box-shadow: var(--shadow-md);
          }
          .nav-menu.active {
            display: flex;
          }
          .nav-link {
            width: 100%;
            display: block;
            text-align: center;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
