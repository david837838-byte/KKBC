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
  const isOnlyVerse = settings.conferenceVerse && !hasTimer && !hasSpeakers;

  return (
    <div style={styles.container}>
      
      {/* Hidden audio element for the alarm */}
      {settings.conferenceTimerSound && (
        <audio ref={audioRef} src={settings.conferenceTimerSound} preload="auto" />
      )}

      {/* Top Logo */}
      {settings.logo && (
        <img src={settings.logo} alt="Church Logo" style={styles.logo} />
      )}

      <div style={{...styles.content, justifyContent: isOnlyVerse ? 'center' : 'flex-start', flex: 1}}>
        
        <div style={styles.topSection}>
          {/* Timer Section */}
          {hasTimer && (
            <div style={styles.timerSection}>
              <div style={styles.timerLabel}>{settings.conferenceTimerLabel}</div>
              <div style={styles.timerValue} className={timeLeft === '00:00:00' ? 'flash' : ''}>
                {timeLeft}
              </div>
            </div>
          )}

          {/* Speakers Section */}
          {hasSpeakers && (
            <div style={styles.speakersWrapper}>
              {/* Current Speaker */}
              {settings.conferenceCurrentSpeaker && (
                <div style={styles.speakerCard}>
                  <div style={styles.speakerLabel}>المتكلم الحالي | Current Speaker</div>
                  <div style={styles.speakerName}>{settings.conferenceCurrentSpeaker}</div>
                </div>
              )}

              {/* Next Speaker */}
              {settings.conferenceNextSpeaker && (
                <div style={styles.nextSpeakerCard}>
                  <div style={styles.nextSpeakerLabel}>يتبعه | Next Speaker</div>
                  <div style={styles.nextSpeakerName}>{settings.conferenceNextSpeaker}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Verse Section - Pushed to center if it's the only thing, or placed below */}
        {settings.conferenceVerse && (
          <div style={{...styles.verseCard, margin: isOnlyVerse ? '0 auto' : 'auto auto 2rem auto'}}>
            "{settings.conferenceVerse}"
          </div>
        )}
      </div>

      <style>{`
        @keyframes flash {
          0%, 100% { color: #f8fafc; }
          50% { color: #ef4444; }
        }
        .flash {
          animation: flash 2s infinite;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Dark blue background
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    boxSizing: 'border-box',
    textAlign: 'center',
    overflow: 'hidden',
    backgroundImage: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
  },
  logo: {
    height: '100px',
    objectFit: 'contain',
    marginBottom: '2rem',
    filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.5))',
    zIndex: 10
  },
  loading: {
    fontSize: '2rem',
    color: '#94a3b8',
    margin: 'auto'
  },
  idleState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    opacity: 0.5,
    margin: 'auto'
  },
  content: {
    width: '100%',
    maxWidth: '1400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4rem',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4rem',
    width: '100%'
  },
  timerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '3rem 5rem',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  timerLabel: {
    fontSize: '2.5rem',
    color: '#94a3b8',
    fontWeight: '500',
    letterSpacing: '2px'
  },
  timerValue: {
    fontSize: '10rem',
    fontWeight: '800',
    color: '#f8fafc',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: '1',
    textShadow: '0 0 40px rgba(255,255,255,0.1)'
  },
  speakersWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem'
  },
  speakerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  speakerLabel: {
    fontSize: '1.5rem',
    color: '#c5a880', // Gold/Accent color
    textTransform: 'uppercase',
    letterSpacing: '4px'
  },
  speakerName: {
    fontSize: '4.5rem',
    fontWeight: '700',
    color: '#ffffff'
  },
  nextSpeakerCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.7
  },
  nextSpeakerLabel: {
    fontSize: '1.2rem',
    color: '#94a3b8',
    letterSpacing: '2px'
  },
  nextSpeakerName: {
    fontSize: '2.5rem',
    fontWeight: '600',
    color: '#cbd5e1'
  },
  verseCard: {
    fontSize: '3rem',
    fontStyle: 'italic',
    color: '#c5a880',
    maxWidth: '1200px',
    lineHeight: '1.6',
    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
    padding: '2rem',
    borderTop: '2px solid rgba(197, 168, 128, 0.2)'
  }
};

export default ConferenceScreen;
