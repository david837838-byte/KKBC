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
      // If timer changes, allow sound to play again
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
        setTimeLeft('00:00:00');
        
        // Play sound exactly once when it hits zero
        if (!hasPlayedSound && settings.conferenceTimerSound && audioRef.current) {
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
          setHasPlayedSound(true);
        }
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        (hours > 0 ? (hours < 10 ? '0' + hours : hours) + ':' : '') +
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds)
      );
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [settings?.conferenceTimerEndTime, hasPlayedSound, settings?.conferenceTimerSound]);

  if (!settings) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>جاري التحميل... / Loading...</div>
      </div>
    );
  }

  if (!settings.isConferenceMode) {
    return (
      <div style={styles.container}>
        <div style={styles.idleState}>
          <span style={{ fontSize: '5rem' }}>🛑</span>
          <h2>وضع المؤتمر متوقف حالياً</h2>
          <p>Conference mode is currently disabled.</p>
        </div>
      </div>
    );
  }

  const hasTimer = !!settings.conferenceTimerEndTime;
  const hasSpeakers = settings.conferenceCurrentSpeaker || settings.conferenceNextSpeaker;

  // Handle relative logo URL
  const logoUrl = settings.logo ? (settings.logo.startsWith('http') ? settings.logo : window.location.origin + settings.logo) : '';

  return (
    <div style={styles.container}>
      
      {/* Hidden audio element for the alarm */}
      {settings.conferenceTimerSound && (
        <audio ref={audioRef} src={settings.conferenceTimerSound} preload="auto" />
      )}

      {/* Top Corner Logo */}
      {logoUrl && (
        <img src={logoUrl} alt="Church Logo" style={styles.logo} onError={(e) => e.target.style.display = 'none'} />
      )}

      {/* Center Content (Timer & Verse) */}
      <div style={styles.centerContent}>
        {hasTimer && (
          <div style={styles.timerSection}>
            <div style={styles.timerLabel}>{settings.conferenceTimerLabel}</div>
            <div style={styles.timerValue} className={timeLeft === '00:00:00' ? 'flash' : ''}>
              {timeLeft}
            </div>
          </div>
        )}

        {settings.conferenceVerse && (
          <div style={styles.verseCard}>
            "{settings.conferenceVerse}"
          </div>
        )}
      </div>

      {/* Bottom Speakers Section */}
      {hasSpeakers && (
        <div style={styles.bottomSection}>
          {/* Right Side (Current Speaker) */}
          <div style={styles.speakerBox}>
            {settings.conferenceCurrentSpeaker && (
              <>
                <div style={styles.speakerLabel}>المتكلم الحالي</div>
                <div style={styles.speakerName}>{settings.conferenceCurrentSpeaker}</div>
              </>
            )}
          </div>

          {/* Left Side (Next Speaker) */}
          <div style={{ ...styles.speakerBox, textAlign: 'left', alignItems: 'flex-end' }}>
            {settings.conferenceNextSpeaker && (
              <>
                <div style={styles.nextSpeakerLabel}>يتبعه</div>
                <div style={styles.nextSpeakerName}>{settings.conferenceNextSpeaker}</div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=Amiri:ital@0;1&display=swap');
        
        @keyframes flash {
          0%, 100% { color: #f8fafc; }
          50% { color: #ef4444; }
        }
        .flash {
          animation: flash 2s infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: '#070f2b', // Very dark rich blue
    backgroundImage: 'linear-gradient(135deg, #070f2b 0%, #1b1a55 50%, #535c91 100%)',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Cairo', sans-serif",
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
    top: '2rem',
    right: '3rem',
    height: '120px',
    objectFit: 'contain',
    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))',
    zIndex: 10,
    animation: 'float 6s ease-in-out infinite'
  },
  loading: {
    fontSize: '2rem',
    color: '#9290c3',
    margin: 'auto',
    fontFamily: "'Cairo', sans-serif"
  },
  idleState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    opacity: 0.6,
    margin: 'auto',
    fontFamily: "'Cairo', sans-serif"
  },
  centerContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4rem',
    width: '100%',
    maxWidth: '1600px',
    padding: '0 2rem',
    zIndex: 2,
    marginTop: '-5rem' // Adjust slightly upwards to balance the bottom speakers
  },
  timerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(7, 15, 43, 0.4)',
    padding: '2.5rem 6rem',
    borderRadius: '30px',
    boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
    border: '1px solid rgba(146, 144, 195, 0.2)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  },
  timerLabel: {
    fontSize: '2.8rem',
    color: '#9290c3',
    fontWeight: '600',
    letterSpacing: '2px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  },
  timerValue: {
    fontSize: '12rem',
    fontWeight: '800',
    color: '#ffffff',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1',
    textShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(146, 144, 195, 0.4)'
  },
  verseCard: {
    fontSize: '4.5rem',
    fontFamily: "'Amiri', serif",
    color: '#e2d3a3', // Elegant gold/beige
    maxWidth: '1400px',
    lineHeight: '1.6',
    textShadow: '0 5px 15px rgba(0,0,0,0.8)',
    textAlign: 'center',
    padding: '0 2rem'
  },
  bottomSection: {
    position: 'absolute',
    bottom: '3rem',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: '0 4rem',
    boxSizing: 'border-box',
    zIndex: 5
  },
  speakerBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
    maxWidth: '45%'
  },
  speakerLabel: {
    fontSize: '1.8rem',
    color: '#9290c3',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    textShadow: '0 2px 5px rgba(0,0,0,0.8)'
  },
  speakerName: {
    fontSize: '4rem',
    fontWeight: '800',
    color: '#ffffff',
    textShadow: '0 5px 15px rgba(0,0,0,0.8)',
    lineHeight: '1.2'
  },
  nextSpeakerLabel: {
    fontSize: '1.5rem',
    color: '#535c91',
    fontWeight: '600',
    letterSpacing: '2px',
    textShadow: '0 2px 5px rgba(0,0,0,0.8)'
  },
  nextSpeakerName: {
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#9290c3',
    textShadow: '0 4px 10px rgba(0,0,0,0.8)',
    lineHeight: '1.2'
  }
};

export default ConferenceScreen;
