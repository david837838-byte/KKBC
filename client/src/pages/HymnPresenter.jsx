import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const HymnPresenter = () => {
  const [activeHymn, setActiveHymn] = useState(null);

  // 1. Load initial active hymn state
  useEffect(() => {
    fetch('/api/hymns/present/active')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setActiveHymn(data.data);
        }
      })
      .catch((err) => console.error('Error fetching active presentation hymn:', err));
  }, []);

  // 2. Setup Socket.io listener for real-time presentation updates
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });

    socket.on('hymnPresentationUpdate', (hymn) => {
      setActiveHymn(hymn);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#05070c',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box',
      textAlign: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Corner Church Brand Logo */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        padding: '6px 16px 6px 8px',
        borderRadius: '50px',
        border: '1px solid rgba(197, 168, 128, 0.4)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        zIndex: 1000,
        direction: 'rtl',
        pointerEvents: 'none',
        userSelect: 'none',
        animation: 'fadeIn 0.8s ease-in-out'
      }}>
        <img 
          src="/logo.png" 
          alt="كنيسة خربة قنافار الإنجيلية" 
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            objectFit: 'contain',
            border: '2px solid var(--accent-color, #c5a880)',
            background: '#ffffff',
            padding: '2px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          onError={(e) => { e.target.src = '/church_logo.png'; }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', lineHeight: '1.25' }}>
          <span style={{ 
            fontSize: '0.98rem', 
            fontWeight: '800', 
            color: '#f8fafc',
            letterSpacing: '0.2px'
          }}>
            الكنيسة المعمدانية الإنجيلية
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600', 
            color: 'var(--accent-color, #c5a880)' 
          }}>
            خربة قنافار — البقاع الغربي
          </span>
        </div>
      </div>

      {activeHymn ? (
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          animation: 'fadeIn 0.6s ease-in-out'
        }}>
          {/* Hymn Content (Image or Lyrics) */}
          {activeHymn.imageUrl ? (
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {activeHymn.imageUrl.toLowerCase().includes('.pdf') ? (
                <iframe 
                  src={`${activeHymn.imageUrl}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={activeHymn.title}
                  style={{
                    height: '95vh',
                    width: '100vw',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  }}
                />
              ) : (
                <img 
                  src={activeHymn.imageUrl} 
                  alt={activeHymn.title} 
                  style={{
                    maxHeight: '95vh',
                    maxWidth: '100vw',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                  }}
                />
              )}
            </div>
          ) : (
            <>
              {/* Hymn Title (Only for text lyrics) */}
              <h1 style={{
                fontSize: '3.5rem',
                color: 'var(--accent-color, #c5a880)',
                margin: 0,
                textShadow: '0 4px 12px rgba(197, 168, 128, 0.2)',
                fontWeight: '800'
              }}>
                {activeHymn.title}
              </h1>
              
              <div style={{
                fontSize: '3rem',
                lineHeight: '1.7',
                whiteSpace: 'pre-line',
                color: '#f1f5f9',
                fontWeight: '600',
                marginTop: '1.5rem',
                maxWidth: '1200px',
                letterSpacing: '0.5px'
              }}>
                {activeHymn.lyrics}
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          opacity: 0.55,
          animation: 'pulse 3s infinite ease-in-out'
        }}>
          <span style={{ fontSize: '5rem' }}>🕊️</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '500', color: 'var(--text-light, #94a3b8)', margin: 0 }}>
            شاشة العرض جاهزة للخدمة
          </h2>
          <p style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-light, #64748b)' }}>
            اختر ترنيمة من لوحة التحكم لبدء البث المباشر على الشاشة
          </p>
        </div>
      )}

      {/* Animation classes inline styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default HymnPresenter;
