import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Volume2, Radio } from 'lucide-react';
import io from 'socket.io-client';
import { useLanguage } from '../context/LanguageContext';

const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const playNote = (freq, delay, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    // Play 3 pleasant bell chime notes
    playNote(587.33, 0, 0.2); // D5
    playNote(880, 0.15, 0.25); // A5
    playNote(1174.66, 0.35, 0.4); // D6
  } catch (e) {
    console.log('Audio chime synthesis:', e);
  }
};

const NotificationBanner = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [toast, setToast] = useState(null);
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    // 1. Check if user already subscribed or dismissed
    const isSubscribedLocal = localStorage.getItem('kkbc_subscribed') === 'true';
    const isDismissed = localStorage.getItem('kkbc_notifications_dismissed') === 'true';

    if (isSubscribedLocal || (window.Notification && Notification.permission === 'granted')) {
      setSubscribed(true);
    } else if (!isDismissed) {
      // Show prompt banner after 2 seconds for all mobile & desktop visitors
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // Register Service Worker for background push if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW Registration optional:', err));
    }

    // 2. Connect to Socket.io for real-time live push broadcasts
    const socket = io('/', { path: '/socket.io' });
    socket.on('pushNotificationBroadcast', (data) => {
      console.log('📢 Received Live Push Notification:', data);
      setToast(data);
      setTimeout(() => setToast(null), 12000);

      // Trigger phone vibration
      if ('vibrate' in navigator) {
        try { navigator.vibrate([200, 100, 200]); } catch (e) {}
      }

      // Play 3-note bell chime sound
      playChimeSound();

      // Trigger native notification if granted and supported
      if (window.Notification && Notification.permission === 'granted') {
        try {
          new Notification(data.title, { body: data.message, icon: data.icon || '/favicon.svg' });
        } catch (e) {}
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubscribe = async () => {
    try {
      setSubscribed(true);
      setShowPrompt(false);
      localStorage.setItem('kkbc_subscribed', 'true');

      if (window.Notification && typeof Notification.requestPermission === 'function') {
        Notification.requestPermission().catch(() => {});
      }

      let endpoint = `web_sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Save subscription endpoint to backend
      fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint,
          keys: {}
        })
      }).catch(err => console.log(err));

      setToast({
        title: isAr ? 'تم تفعيل التنبيهات المباشرة 🔔' : 'Notifications Enabled 🔔',
        message: isAr ? 'شكراً لك! ستصلك التنبيهات الفورية عند بدء البث المباشر والإعلانات الكنسية.' : 'Thank you! You will receive instant notifications for live streams and updates.'
      });
      setTimeout(() => setToast(null), 6000);
    } catch (error) {
      console.error('Permission request error:', error);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('kkbc_notifications_dismissed', 'true');
  };

  return (
    <>
      {/* Real-time Broadcast Floating Toast Notification */}
      {toast && (
        <div 
          className="glass-card" 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            left: '20px',
            maxWidth: '420px',
            margin: '0 auto',
            zIndex: 999999,
            padding: '1.25rem',
            borderRadius: '16px',
            boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
            borderRight: isAr ? '5px solid #2196f3' : 'none',
            borderLeft: isAr ? 'none' : '5px solid #2196f3',
            backdropFilter: 'blur(16px)',
            animation: 'fadeInDown 0.4s ease-out',
            background: 'var(--card-bg, rgba(20, 25, 40, 0.95))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)', padding: '0.5rem', borderRadius: '50%', color: '#2196f3' }}>
              <Radio size={20} className="live-icon-blink" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 'bold' }}>{toast.title}</h4>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 0 }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Subscription Banner Prompt */}
      {showPrompt && !subscribed && (
        <div 
          className="glass-card"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            maxWidth: '480px',
            margin: '0 auto',
            zIndex: 9990,
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
            backdropFilter: 'blur(16px)',
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.18)', color: '#d4af37', padding: '0.65rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                {isAr ? 'تفعيل التنبيهات المباشرة للكنيسة 🔔' : 'Enable Church Live Alerts 🔔'}
              </h4>
              <p style={{ margin: '0.35rem 0 0.85rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {isAr 
                  ? 'احصل على تنبيهات فورية عند بدء البث المباشر، نشر العظات الجديدة، والإعلانات الكنسية الهامة.' 
                  : 'Receive instant notifications for live streams, new sermons, and important updates.'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubscribe} 
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Check size={14} />
                  <span>{isAr ? 'تفعيل التنبيهات 🔔' : 'Enable Notifications'}</span>
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={handleDismiss} 
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <span>{isAr ? 'ليس الآن' : 'Not Now'}</span>
                </button>
              </div>
            </div>
            <button onClick={handleDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: 0 }}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBanner;
