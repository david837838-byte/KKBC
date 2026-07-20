import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    // Check if app is already running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    // Detect browser install prompt (Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show banner after a short delay so it doesn't annoy the user immediately
      const closedTime = localStorage.getItem('pwa_banner_closed_time');
      const now = Date.now();
      // Only show if not closed in the last 24 hours
      if (!closedTime || (now - parseInt(closedTime)) > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      const closedTime = localStorage.getItem('pwa_banner_closed_time');
      const now = Date.now();
      if (!closedTime || (now - parseInt(closedTime)) > 24 * 60 * 60 * 1000) {
        setIsVisible(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      // Android / Chrome flow
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      // iOS / Safari flow - show instructions modal
      setShowIOSModal(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('pwa_banner_closed_time', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="pwa-install-banner animate-slide-up">
        <div className="banner-content">
          <Smartphone className="banner-icon" size={24} />
          <div className="banner-text">
            <h4>{language === 'ar' ? 'تطبيق كنيسة خربة قنافار 📱' : 'Khirbet Qanafar Church App 📱'}</h4>
            <p>{language === 'ar' ? 'ثبّت التطبيق الآن على هاتفك للوصول السريع والتنبيهات المباشرة!' : 'Install the app now on your phone for quick access & alerts!'}</p>
          </div>
          <div className="banner-actions">
            <button className="btn btn-accent install-btn" onClick={handleInstallClick}>
              <Download size={16} />
              <span>{language === 'ar' ? 'تنزيل وتثبيت' : 'Download & Install'}</span>
            </button>
            <button className="close-btn" onClick={handleClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <style>{`
          .pwa-install-banner {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(15, 35, 67, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(197, 168, 128, 0.3);
            border-radius: 16px;
            padding: 1rem 1.5rem;
            color: white;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
            max-width: 600px;
            margin: 0 auto;
          }
          .banner-content {
            display: flex;
            align-items: center;
            gap: 1.2rem;
            justify-content: space-between;
          }
          .banner-icon {
            color: var(--accent-color);
            flex-shrink: 0;
          }
          .banner-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .banner-text h4 {
            font-size: 1rem;
            font-weight: 700;
            color: white;
          }
          .banner-text p {
            font-size: 0.85rem;
            color: #cbd5e1;
            line-height: 1.4;
          }
          .banner-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .install-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            font-weight: 700;
            white-space: nowrap;
          }
          .close-btn {
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            outline: none;
            transition: color 0.2s;
          }
          .close-btn:hover {
            color: white;
          }

          @media (max-width: 768px) {
            .pwa-install-banner {
              bottom: 10px;
              left: 10px;
              right: 10px;
              padding: 0.8rem 1rem;
            }
            .banner-content {
              flex-direction: column;
              text-align: center;
              gap: 0.8rem;
            }
            .banner-actions {
              width: 100%;
              justify-content: space-between;
            }
            .install-btn {
              flex: 1;
              justify-content: center;
            }
          }
        `}</style>
      </div>

      {/* iOS Safari Instructions Modal */}
      {showIOSModal && (
        <div className="ios-install-modal-overlay">
          <div className="ios-install-modal glass-card">
            <div className="modal-header">
              <h3>تثبيت التطبيق على آيفون (iPhone) 🍏</h3>
              <button className="close-btn" onClick={() => setShowIOSModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>لتثبيت تطبيق كنيسة خربة قنافار على جهاز الآيفون الخاص بك، يرجى اتباع الخطوتين التاليتين باستخدام متصفح <strong>Safari</strong>:</p>
              
              <ol className="ios-steps">
                <li>
                  <div className="step-num">1</div>
                  <p>اضغط على زر <strong>«مشاركة» (Share)</strong> <span style={{ fontSize: '1.2rem' }}>📤</span> أسفل شاشة المتصفح.</p>
                </li>
                <li>
                  <div className="step-num">2</div>
                  <p>اختر من القائمة <strong>«إضافة إلى الشاشة الرئيسية» (Add to Home Screen)</strong> <span style={{ fontSize: '1.2rem' }}>➕</span>.</p>
                </li>
              </ol>

              <div className="ios-note">
                <Info size={16} />
                <span>سيتم تنزيل وتثبيت أيقونة التطبيق على شاشتك الرئيسية مباشرة لتصل لكافة الخدمات الروحية بنقرة واحدة!</span>
              </div>
            </div>
          </div>

          <style>{`
            .ios-install-modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.6);
              backdrop-filter: blur(5px);
              z-index: 10000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 1.5rem;
            }
            .ios-install-modal {
              width: 100%;
              max-width: 480px;
              padding: 2rem;
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              border: 1px solid rgba(197, 168, 128, 0.3);
            }
            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid var(--border-color);
              padding-bottom: 0.75rem;
            }
            .modal-header h3 {
              color: var(--accent-color);
            }
            .ios-steps {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              list-style: none;
              padding: 0;
              margin: 1rem 0;
            }
            .ios-steps li {
              display: flex;
              align-items: flex-start;
              gap: 1rem;
            }
            .step-num {
              background: var(--primary-color);
              color: white;
              width: 28px;
              height: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-weight: bold;
              flex-shrink: 0;
            }
            [data-theme="dark"] .step-num {
              background: var(--accent-color);
              color: var(--primary-color);
            }
            .ios-steps p {
              font-size: 0.95rem;
              line-height: 1.5;
            }
            .ios-note {
              display: flex;
              gap: 0.75rem;
              padding: 1rem;
              background: rgba(197, 168, 128, 0.1);
              border-radius: 8px;
              border-right: 4px solid var(--accent-color);
              font-size: 0.85rem;
              color: var(--text-secondary);
              line-height: 1.4;
            }
            .ios-note svg {
              color: var(--accent-color);
              flex-shrink: 0;
              margin-top: 0.15rem;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
