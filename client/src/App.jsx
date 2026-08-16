import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { LanguageProvider } from './context/LanguageContext';
import './english.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Meetings from './pages/Meetings';
import Sermons from './pages/Sermons';
import LiveStream from './pages/LiveStream';
import Hymns from './pages/Hymns';
import Prayer from './pages/Prayer';
import News from './pages/News';
import Articles from './pages/Articles';
import DownloadApp from './pages/DownloadApp';
import InstallBanner from './components/InstallBanner';
import NotificationBanner from './components/NotificationBanner';
import SEOHead from './components/SEOHead';
import Counseling from './pages/Counseling';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Bible from './pages/Bible';
import HymnPresenter from './pages/HymnPresenter';
import ConferenceScreen from './pages/ConferenceScreen';

// Helper component to track page views and live stream views
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Record general page view with path
    fetch('/api/analytics/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page', path: location.pathname })
    }).catch(err => console.error('Error logging visit:', err));

    // 2. Record livestream view if viewing /live
    if (location.pathname === '/live') {
      fetch('/api/analytics/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'live', path: '/live' })
      }).catch(err => console.error('Error logging live visit:', err));
    }
  }, [location.pathname]);

  return null;
};

// Component to handle conditional layouts and routing
const AppContent = ({ isAdmin, setIsAdmin, theme, toggleTheme }) => {
  const location = useLocation();
  const isPresentation = location.pathname === '/hymns/present' || location.pathname === '/conference';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Dynamic SEO Head Manager */}
      <SEOHead />

      {/* Navbar */}
      {!isPresentation && (
        <Navbar 
          isAdmin={isAdmin} 
          setIsAdmin={setIsAdmin} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/live" element={<LiveStream />} />
          <Route path="/hymns" element={<Hymns />} />
          <Route path="/hymns/present" element={<HymnPresenter />} />
          <Route path="/conference" element={<ConferenceScreen />} />
          <Route path="/bible" element={<Bible />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/download" element={<DownloadApp />} />
          <Route path="/counseling" element={<Counseling />} />
          <Route path="/login" element={<Login isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
          
          {/* Protected Route for Admin Dashboard */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard setIsAdmin={setIsAdmin} /> : <Navigate to="/login" replace />} 
          />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      {!isPresentation && <Footer />}

      {/* Floating AI Chatbot Widget */}
      {!isPresentation && <Chatbot />}

      {/* Smart PWA Install Prompt Banner */}
      {!isPresentation && <InstallBanner />}

      {/* Push Notification Banner & Toasts */}
      {!isPresentation && <NotificationBanner />}
    </div>
  );
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Sync token state on mount or storage events
  useEffect(() => {
    const handleStorage = () => {
      setIsAdmin(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Theme Management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <LanguageProvider>
      <Router>
        <AnalyticsTracker />
        <AppContent 
          isAdmin={isAdmin} 
          setIsAdmin={setIsAdmin} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      </Router>
    </LanguageProvider>
  );
};

export default App;
