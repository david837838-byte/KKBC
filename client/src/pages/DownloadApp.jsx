import React, { useState, useEffect } from 'react';
import { Smartphone, Download, AlertCircle, Share2, Plus, Info, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DownloadApp = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert(language === 'ar' ? 'لتثبيت التطبيق على جهاز الأندرويد، انقر على زر القائمة (3 نقاط) ثم اختر "تثبيت التطبيق".' : 'To install the app on Android, tap browser menu (3 dots) and select "Install app".');
    }
  };

  return (
    <div className="download-app-page container animate-fade-in">
      <div className="download-hero text-center">
        <Smartphone className="hero-icon" size={64} />
        <h1>{t('downloadApp.title')} 📱</h1>
        <p className="page-intro">
          {t('downloadApp.subtitle')}
        </p>
      </div>

      <div className="install-grid">
        {/* Android Installation */}
        <div className="install-card glass-card">
          <div className="card-header-app">
            <span className="platform-icon">🤖</span>
            <h3>{language === 'ar' ? 'تحميل للأندرويد (Android)' : 'Android Installation'}</h3>
          </div>
          <p className="card-desc">
            {language === 'ar' ? 'يدعم التثبيت المباشر الفوري على كافة أجهزة الأندرويد من خلال متصفح Chrome.' : 'Supports instant direct installation on all Android devices via Google Chrome.'}
          </p>

          <div className="steps-list-download">
            <div className="step-item">
              <span className="step-badge">1</span>
              <p>{language === 'ar' ? 'افتح هذا الموقع من خلال متصفح Google Chrome.' : 'Open this site in Google Chrome browser.'}</p>
            </div>
            <div className="step-item">
              <span className="step-badge">2</span>
              <p>{language === 'ar' ? 'اضغط على زر «تثبيت وتنزيل التطبيق» بالأسفل.' : 'Tap "Download for Android Now" button below.'}</p>
            </div>
            <div className="step-item">
              <span className="step-badge">3</span>
              <p>{language === 'ar' ? 'أو انقر على النقاط الثلاث بالأعلى واختر «تثبيت التطبيق».' : 'Or click the 3 dots menu and select "Install app".'}</p>
            </div>
          </div>

          <button className="btn btn-primary download-action-btn" onClick={handleAndroidInstall}>
            <Download size={18} />
            <span>{language === 'ar' ? 'تنزيل للأندرويد الآن' : 'Download for Android Now'}</span>
          </button>
        </div>

        {/* iOS Installation */}
        <div className="install-card glass-card">
          <div className="card-header-app">
            <span className="platform-icon">🍏</span>
            <h3>{language === 'ar' ? 'تحميل للآيفون والآيباد (iOS)' : 'iPhone & iPad (iOS) Installation'}</h3>
          </div>
          <p className="card-desc">
            {language === 'ar' ? 'يدعم هواتف الآيفون بجميع إصداراتها ويتم تثبيته كتطبيق مستقل مباشر دون الحاجة لمتجر التطبيقات.' : 'Supports all iPhone models. Installs directly without needing an App Store account.'}
          </p>

          <div className="steps-list-download">
            <div className="step-item">
              <span className="step-badge">1</span>
              <p>{language === 'ar' ? 'تأكد من فتح الموقع باستخدام متصفح Safari الأصلي.' : 'Open this site using the native Safari browser.'}</p>
            </div>
            <div className="step-item">
              <span className="step-badge">2</span>
              <p>{language === 'ar' ? 'اضغط على أيقونة «مشاركة» (Share) بأسفل الشاشة.' : 'Tap the "Share" icon at the bottom of the screen.'}</p>
            </div>
            <div className="step-item">
              <span className="step-badge">3</span>
              <p>{language === 'ar' ? 'اختر من القائمة «إضافة إلى الشاشة الرئيسية».' : 'Select "Add to Home Screen" from the menu.'}</p>
            </div>
          </div>

          <button className="btn btn-accent download-action-btn" onClick={() => setShowIOSInstructions(true)}>
            <Download size={18} />
            <span>{language === 'ar' ? 'عرض تعليمات الآيفون' : 'View iPhone Instructions'}</span>
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="app-benefits-section text-center">
        <h2>{language === 'ar' ? 'لماذا تثبّت تطبيق الكنيسة؟ 🌟' : 'Why Install the Church App? 🌟'}</h2>
        <div className="benefits-grid">
          <div className="benefit-item glass-card">
            <div className="benefit-badge">🔔</div>
            <h4>{language === 'ar' ? 'تنبيهات البث والخدمات الروحية' : 'Live Stream & Event Alerts'}</h4>
            <p>{language === 'ar' ? 'سيرسل لك التطبيق إشعاراً فورياً عند بدء القسيس بالبث المباشر للاجتماع العام.' : 'Receive instant notifications when live streams begin or new sermons are published.'}</p>
          </div>
          <div className="benefit-item glass-card">
            <div className="benefit-badge">💾</div>
            <h4>{language === 'ar' ? 'لا يستهلك مساحة تخزين' : 'Zero Storage Consumption'}</h4>
            <p>{language === 'ar' ? 'التطبيق ذكي وصغير الحجم، حيث لا يستهلك أي مساحة من ذاكرة هاتفك.' : 'Lightweight and smart app that consumes almost zero device storage.'}</p>
          </div>
          <div className="benefit-item glass-card">
            <div className="benefit-badge">🌐</div>
            <h4>{language === 'ar' ? 'الوصول حتى دون اتصال بالشبكة' : 'Offline Access'}</h4>
            <p>{language === 'ar' ? 'يحتفظ التطبيق بنسخ احتياطية لتتمكن من تصفح الترانيم والكتاب المقدس أوفلاين.' : 'Browse hymns and read the Holy Bible even without an active internet connection.'}</p>
          </div>
        </div>
      </div>

      {/* iOS Instructions Overlay */}
      {showIOSInstructions && (
        <div className="ios-instructions-modal-overlay">
          <div className="ios-modal glass-card">
            <div className="ios-modal-header">
              <h3>{language === 'ar' ? 'تثبيت التطبيق على آيفون (iPhone) 🍏' : 'Installing App on iPhone (iOS) 🍏'}</h3>
              <button className="ios-close-btn" onClick={() => setShowIOSInstructions(false)}>✕</button>
            </div>
            <div className="ios-modal-body">
              <p>{language === 'ar' ? 'يرجى اتباع الخطوات البسيطة التالية من خلال متصفح Safari:' : 'Please follow these simple steps using Safari browser:'}</p>
              
              <div className="ios-steps-container">
                <div className="ios-step-row">
                  <span className="badge-step">1</span>
                  <p>{language === 'ar' ? 'انقر على أيقونة المشاركة (السهم الخارج من مربع) بأسفل الشاشة.' : 'Tap the Share icon (square with arrow pointing up) at bottom toolbar.'}</p>
                </div>
                <div className="ios-step-row">
                  <span className="badge-step">2</span>
                  <p>{language === 'ar' ? 'اسحب القائمة لأعلى واضغط على «إضافة إلى الشاشة الرئيسية».' : 'Scroll down and tap "Add to Home Screen".'}</p>
                </div>
                <div className="ios-step-row">
                  <span className="badge-step">3</span>
                  <p>اضغط على <strong>«إضافة» (Add)</strong> في أعلى الزاوية اليمنى لتأكيد التثبيت.</p>
                </div>
              </div>

              <div className="ios-notice-box">
                <Info size={16} />
                <span>الآن ستجد أيقونة تطبيق الكنيسة مثبتة بين تطبيقاتك!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .download-app-page {
          padding-top: 3rem;
          padding-bottom: 5rem;
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }
        .download-hero {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .hero-icon {
          color: var(--accent-color);
        }
        .download-hero h1 {
          font-size: 2.2rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .download-hero h1 {
          color: white;
        }
        .page-intro {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .install-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 992px) {
          .install-grid {
            grid-template-columns: 1fr;
          }
        }
        .install-card {
          padding: 2.5rem;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          transition: transform 0.3s ease;
        }
        .card-header-app {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.75rem;
        }
        .platform-icon {
          font-size: 1.8rem;
        }
        .card-header-app h3 {
          font-size: 1.3rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .card-header-app h3 {
          color: white;
        }
        .card-desc {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .steps-list-download {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 0.5rem 0;
          flex: 1;
        }
        .step-item {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
        }
        .step-badge {
          background: var(--primary-color);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: bold;
          flex-shrink: 0;
        }
        [data-theme="dark"] .step-badge {
          background: var(--accent-color);
          color: var(--primary-color);
        }
        .step-item p {
          font-size: 0.9rem;
          color: var(--text-main);
          line-height: 1.4;
        }
        .download-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.9rem;
          font-weight: 700;
          font-size: 0.95rem;
        }

        /* Benefits */
        .app-benefits-section h2 {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }
        [data-theme="dark"] .app-benefits-section h2 {
          color: white;
        }
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
        }
        .benefit-item {
          padding: 2rem;
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        .benefit-badge {
          font-size: 2rem;
        }
        .benefit-item h4 {
          font-size: 1.1rem;
          color: var(--primary-color);
        }
        [data-theme="dark"] .benefit-item h4 {
          color: white;
        }
        .benefit-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Modal Overlay iOS */
        .ios-instructions-modal-overlay {
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
        .ios-modal {
          width: 100%;
          max-width: 480px;
          padding: 2.5rem;
          border: 1px solid rgba(197, 168, 128, 0.3);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .ios-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }
        .ios-modal-header h3 {
          color: var(--accent-color);
        }
        .ios-close-btn {
          background: none;
          border: none;
          color: var(--text-light);
          font-size: 1.5rem;
          cursor: pointer;
          outline: none;
        }
        .ios-steps-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin: 0.5rem 0;
        }
        .ios-step-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .badge-step {
          background: var(--primary-color);
          color: white;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 0.8rem;
          font-weight: bold;
          flex-shrink: 0;
        }
        [data-theme="dark"] .badge-step {
          background: var(--accent-color);
          color: var(--primary-color);
        }
        .ios-step-row p {
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .ios-notice-box {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(197, 168, 128, 0.1);
          border-radius: 8px;
          border-right: 4px solid var(--accent-color);
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .ios-notice-box svg {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
      `}</style>
    </div>
  );
};

export default DownloadApp;
