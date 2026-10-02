import React, { useState, useEffect } from 'react';
import { Bell, X, Check, BookOpen } from 'lucide-react';
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

// Convert VAPID base64 public key to Uint8Array for pushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Subscribe browser to PushManager and register with server
async function registerWebPushSubscription() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Fetch VAPID public key
    const res = await fetch('/api/notifications/vapid-key');
    const data = await res.json();
    if (!data.success || !data.publicKey) {
      console.warn('VAPID public key not available from server');
      return null;
    }

    const applicationServerKey = urlBase64ToUint8Array(data.publicKey);

    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
    }

    // Send subscription to backend
    if (subscription) {
      const subJSON = subscription.toJSON();
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJSON.endpoint,
          keys: subJSON.keys
        })
      });
      console.log('✅ Device successfully registered for Web Push notifications');
      return subscription;
    }
  } catch (err) {
    console.error('Failed to register Web Push subscription:', err);
  }
  return null;
}

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

    // Register Service Worker for background push if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          // If already permitted, ensure subscription is synced with server
          if (window.Notification && Notification.permission === 'granted') {
            registerWebPushSubscription();
          }
        })
        .catch(err => console.log('SW Registration optional:', err));
    }

    if (isSubscribedLocal || (window.Notification && Notification.permission === 'granted')) {
      setSubscribed(true);
    } else if (!isDismissed) {
      // Show prompt banner after 2 seconds for visitors
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // 2. Connect to Socket.io for real-time live push broadcasts
    const socket = io('/', { path: '/socket.io' });
    socket.on('pushNotificationBroadcast', (data) => {
      console.log('📢 Received Live Push Notification:', data);
      setToast(data);
      setTimeout(() => setToast(null), 14000);

      // Trigger phone vibration
      if ('vibrate' in navigator) {
        try { navigator.vibrate([200, 100, 200]); } catch (e) {}
      }

      // Play pleasant 3-note bell chime sound
      playChimeSound();

      // Trigger native notification if granted
      if (window.Notification && Notification.permission === 'granted') {
        try {
          new Notification(data.title, {
            body: data.message || data.body,
            icon: data.icon || '/favicon.svg',
            tag: data.tag || 'daily-verse'
          });
        } catch (e) {}
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubscribe = async () => {
    try {
      setShowPrompt(false);
      setSubscribed(true);
      localStorage.setItem('kkbc_subscribed', 'true');

      let permissionGranted = false;
      if (window.Notification && typeof Notification.requestPermission === 'function') {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') permissionGranted = true;
      }

      // Attempt full Web Push subscription
      const pushSub = await registerWebPushSubscription();

      // Fallback if pushManager is not supported but user wanted notifications
      if (!pushSub) {
        let endpoint = `web_sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint, keys: {} })
        }).catch(err => console.log(err));
      }

      setToast({
        title: isAr ? 'تم تفعيل التنبيهات بنجاح! 📖🔔' : 'Notifications Enabled! 📖🔔',
        message: isAr 
          ? 'ستصلك آية اليوم المشجعة كل صباح فور تغيرها، وتنبيهات البث المباشر والإعلانات الكنسية على جهازك.' 
          : 'You will receive the daily verse every morning and notifications for live streams.'
      });
      setTimeout(() => setToast(null), 7000);
    } catch (error) {
      console.error('Permission request error:', error);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('kkbc_notifications_dismissed', 'true');
  };

  const handleToastClick = () => {
    if (toast && toast.url) {
      window.location.href = toast.url;
    } else {
      const verseEl = document.getElementById('daily-verse-section');
      if (verseEl) {
        verseEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setToast(null);
  };

  return (
    <>
      {/* Real-time Broadcast Floating Toast Notification */}
      {toast && (
        <div 
          className="glass-card" 
          onClick={handleToastClick}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            left: '20px',
            maxWidth: '440px',
            margin: '0 auto',
            zIndex: 999999,
            padding: '1.25rem',
            borderRadius: '16px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            borderRight: isAr ? '5px solid #d4af37' : 'none',
            borderLeft: isAr ? 'none' : '5px solid #d4af37',
            backdropFilter: 'blur(20px)',
            animation: 'fadeInDown 0.4s ease-out',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)', padding: '0.6rem', borderRadius: '50%', color: '#d4af37', flexShrink: 0 }}>
              <BookOpen size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>{toast.title}</h4>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.92)', lineHeight: '1.5' }}>
                {toast.message || toast.body}
              </p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#d4af37', fontWeight: 600 }}>
                {isAr ? 'اضغط هنا لفتح الآية في الموقع 👈' : 'Click here to view in site 👈'}
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setToast(null); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)', padding: '4px' }}
            >
              <X size={18} />
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
            maxWidth: '500px',
            margin: '0 auto',
            zIndex: 9990,
            padding: '1.35rem',
            borderRadius: '18px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(20px)',
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'var(--card-bg, rgba(30, 41, 59, 0.96))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.22)', color: '#d4af37', padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bell size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold' }}>
                {isAr ? 'تفعيل إشعارات آية اليوم والكنيسة 📖🔔' : 'Enable Daily Verse & Church Alerts 📖🔔'}
              </h4>
              <p style={{ margin: '0.4rem 0 0.95rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isAr 
                  ? 'احصل على إشعار تلقائي على هاتفك وجهازك كلما تغيرت آية اليوم بآية تشجيعية جديدة، بالإضافة لإشعارات البث المباشر فور بدئه.' 
                  : 'Receive instant notifications on your phone whenever the daily verse changes, plus live stream alerts.'}
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubscribe} 
                  style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}
                >
                  <Check size={16} />
                  <span>{isAr ? 'تفعيل الإشعارات الآن 🔔' : 'Enable Notifications Now'}</span>
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={handleDismiss} 
                  style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}
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
