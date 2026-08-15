import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ConferenceScreen = () => {
  const [settings, setSettings] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const audioRef = useRef(null);

  // 1. Fetch initial settings
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch((err) => console.error('Error fetching conference settings:', err));
  }, []);

  // 2. Setup Socket.io listener for real-time updates
  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });

    socket.on('conferenceUpdate', (updatedSettings) => {
      setSettings(prev => {
        if (prev && updatedSettings.conferenceTimerEndTime !== prev.conferenceTimerEndTime) {
          setHasPlayedSound(false);
        }
        return updatedSettings;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 3. Countdown timer logic
  useEffect(() => {
    if (!settings?.conferenceTimerEndTime) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const end = new Date(settings.conferenceTimerEndTime).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance <= 0) {
        setTimeLeft('00:00');
        
        // Play sound exactly once when it hits zero
        if (!hasPlayedSound && settings.conferenceTimerSound && audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          setHasPlayedSound(true);
        }
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(
          `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        );
      } else {
        setTimeLeft(
          `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [settings?.conferenceTimerEndTime, hasPlayedSound, settings?.conferenceTimerSound]);

  if (!settings) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>جاري التحميل...</div>
      </div>
    );
  }

  if (!settings.isConferenceMode) {
    return (
      <div style={styles.container}>
        <div style={styles.idleState}>
          <span style={{ fontSize: '4rem' }}>🛑</span>
          <h2 style={{ fontSize: '2rem', margin: '1rem 0 0.5rem' }}>وضع المؤتمر متوقف حالياً</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Conference mode is currently disabled.</p>
        </div>
      </div>
    );
  }

  const hasTimer = !!settings.conferenceTimerEndTime && !!timeLeft;
  const hasCurrentSpeaker = !!settings.conferenceCurrentSpeaker;
  const hasNextSpeaker = !!settings.conferenceNextSpeaker;
  const hasVerse = !!settings.conferenceVerse;

  // Resolve Logo URL
  const logoUrl = settings.logo || '/logo.png';

  return (
    <div style={styles.container} dir="rtl">
      
      {/* Background Ambient Glows */}
      <div style={styles.glowTop}></div>
      <div style={styles.glowBottom}></div>

      {/* Hidden audio element for the alarm */}
      {settings.conferenceTimerSound && (
        <audio ref={audioRef} src={settings.conferenceTimerSound} preload="auto" />
      )}

      {/* ================= HEADER BAR ================= */}
      <header style={styles.header}>
        {/* Right side: Church Logo & Name */}
        <div style={styles.brandBox}>
          <img 
            src={logoUrl} 
            alt="Church Logo" 
            style={styles.logoImg} 
            onError={(e) => { e.target.src = '/logo.png'; }}
          />
          <div style={styles.brandText}>
            <span style={styles.churchName}>الكنيسة المعمدانية الإنجيلية</span>
            <span style={styles.churchLocation}>خربة قنافار — البقاع الغربي</span>
          </div>
        </div>

        {/* Left side: Live Conference Badge */}
        <div style={styles.liveBadge}>
          <span style={styles.liveDot}></span>
          <span>مؤتمر الكنيسة العام</span>
        </div>
      </header>

      {/* ================= MAIN CONTENT (CENTER) ================= */}
      <main style={styles.mainCenter}>
        
        {/* Timer Card */}
        {hasTimer && (
          <div style={styles.timerCard}>
            <div style={styles.timerHeader}>
              <span style={styles.timerIcon}>⏱️</span>
              <span style={styles.timerLabel}>{settings.conferenceTimerLabel || 'الوقت المتبقي'}</span>
            </div>
            <div style={styles.timerDisplay} className={timeLeft === '00:00' ? 'timer-flash' : ''}>
              {timeLeft}
            </div>
          </div>
        )}

        {/* Verse Card */}
        {hasVerse && (
          <div style={styles.verseContainer}>
            <div style={styles.verseQuoteMarkStart}>“</div>
            <p style={styles.verseText}>
              {settings.conferenceVerse}
            </p>
            <div style={styles.verseQuoteMarkEnd}>”</div>
          </div>
        )}

      </main>

      {/* ================= FOOTER BAR (SPEAKERS) ================= */}
      <footer style={styles.footer}>
        
        {/* Right side: Current Speaker */}
        <div style={styles.speakerCardCurrent}>
          {hasCurrentSpeaker ? (
            <>
              <div style={styles.speakerBadgeCurrent}>
                <span style={styles.speakerPulse}></span>
                🎙️ المتكلم الحالي
              </div>
              <div style={styles.speakerNameCurrent}>
                {settings.conferenceCurrentSpeaker}
              </div>
            </>
          ) : (
            <div style={styles.emptySpeakerPlaceholder}>
              <span style={{ opacity: 0.4 }}>— مرحباً بكم في بيت الرب —</span>
            </div>
          )}
        </div>

        {/* Left side: Next Speaker */}
        <div style={styles.speakerCardNext}>
          {hasNextSpeaker ? (
            <>
              <div style={styles.speakerBadgeNext}>
                ⏳ يتبعه في البرنامج
              </div>
              <div style={styles.speakerNameNext}>
                {settings.conferenceNextSpeaker}
              </div>
            </>
          ) : (
            <div style={{ visibility: 'hidden' }}>Next</div>
          )}
        </div>

      </footer>

      {/* Embedded Styles & Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body, html {
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }

        @keyframes timerAlert {
          0%, 100% { color: #ffffff; text-shadow: 0 0 30px rgba(239, 68, 68, 0.8); }
          50% { color: #ef4444; text-shadow: 0 0 50px rgba(239, 68, 68, 1); }
        }

        .timer-flash {
          animation: timerAlert 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    position: 'relative',
    backgroundColor: '#070b19',
    backgroundImage: 'radial-gradient(ellipse at 50% 15%, #18224b 0%, #0d142d 55%, #050814 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: "'Cairo', sans-serif",
    overflow: 'hidden',
    padding: '1.5rem 3rem',
  },

  // Ambient glows
  glowTop: {
    position: 'absolute',
    top: '-20%',
    left: '25%',
    width: '50vw',
    height: '40vh',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
    zIndex: 1
  },
  glowBottom: {
    position: 'absolute',
    bottom: '-15%',
    right: '15%',
    width: '45vw',
    height: '35vh',
    background: 'radial-gradient(circle, rgba(217, 119, 6, 0.1) 0%, rgba(0,0,0,0) 70%)',
    pointerEvents: 'none',
    zIndex: 1
  },

  loading: {
    fontSize: '2rem',
    color: '#93c5fd',
    margin: 'auto'
  },
  idleState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 'auto',
    opacity: 0.8
  },

  // ================= HEADER =================
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0.75rem 1.5rem',
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    zIndex: 10,
    flexShrink: 0
  },
  brandBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  },
  logoImg: {
    width: '58px',
    height: '58px',
    objectFit: 'contain',
    borderRadius: '50%',
    background: '#ffffff',
    padding: '3px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
    border: '2px solid #d4af37'
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1.3'
  },
  churchName: {
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '0.5px'
  },
  churchLocation: {
    fontSize: '0.95rem',
    color: '#d4af37',
    fontWeight: '600'
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.6rem 1.25rem',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '30px',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fca5a5'
  },
  liveDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    boxShadow: '0 0 10px #ef4444',
    animation: 'pulseDot 2s infinite'
  },

  // ================= MAIN CENTER =================
  mainCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '1rem 0',
    gap: '1.75rem',
    zIndex: 10,
    overflow: 'hidden'
  },

  // Timer Card
  timerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    padding: '1.25rem 4.5rem',
    borderRadius: '28px',
    border: '1px solid rgba(147, 197, 253, 0.25)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    flexShrink: 0
  },
  timerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.25rem'
  },
  timerIcon: {
    fontSize: '1.4rem'
  },
  timerLabel: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#93c5fd',
    letterSpacing: '1px'
  },
  timerDisplay: {
    fontSize: '5.8rem',
    fontWeight: '900',
    color: '#ffffff',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1.05',
    textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 0 30px rgba(59, 130, 246, 0.5)',
    letterSpacing: '3px'
  },

  // Verse Container
  verseContainer: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '24px',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), inset 0 0 30px rgba(212, 175, 55, 0.05)',
    padding: '1.5rem 3.5rem',
    maxWidth: '92%',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
    overflow: 'hidden'
  },
  verseQuoteMarkStart: {
    position: 'absolute',
    top: '-15px',
    right: '25px',
    fontSize: '5rem',
    color: 'rgba(212, 175, 55, 0.35)',
    fontFamily: "'Amiri', serif",
    lineHeight: 1
  },
  verseQuoteMarkEnd: {
    position: 'absolute',
    bottom: '-35px',
    left: '25px',
    fontSize: '5rem',
    color: 'rgba(212, 175, 55, 0.35)',
    fontFamily: "'Amiri', serif",
    lineHeight: 1
  },
  verseText: {
    fontSize: '2.5rem',
    fontFamily: "'Amiri', serif",
    fontWeight: '700',
    color: '#fbf0b9', // Luxury warm gold
    lineHeight: '1.65',
    textShadow: '0 3px 10px rgba(0, 0, 0, 0.9)',
    zIndex: 2,
    margin: 0
  },

  // ================= FOOTER (SPEAKERS) =================
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '1rem 2rem',
    background: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.4)',
    zIndex: 10,
    flexShrink: 0
  },

  // Current Speaker (Right)
  speakerCardCurrent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.35rem',
    maxWidth: '55%'
  },
  speakerBadgeCurrent: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.35rem 0.9rem',
    background: 'linear-gradient(90deg, rgba(217, 119, 6, 0.25) 0%, rgba(245, 158, 11, 0.1) 100%)',
    border: '1px solid rgba(245, 158, 11, 0.4)',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fbbf24'
  },
  speakerPulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#fbbf24',
    boxShadow: '0 0 8px #fbbf24'
  },
  speakerNameCurrent: {
    fontSize: '2.4rem',
    fontWeight: '900',
    color: '#ffffff',
    textShadow: '0 3px 12px rgba(0, 0, 0, 0.8)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  },

  // Next Speaker (Left)
  speakerCardNext: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.35rem',
    maxWidth: '40%',
    textAlign: 'left'
  },
  speakerBadgeNext: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.9rem',
    background: 'rgba(100, 116, 139, 0.2)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#cbd5e1'
  },
  speakerNameNext: {
    fontSize: '1.9rem',
    fontWeight: '800',
    color: '#93c5fd',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  },

  emptySpeakerPlaceholder: {
    fontSize: '1.2rem',
    color: '#64748b',
    fontWeight: '600'
  }
};

export default ConferenceScreen;
