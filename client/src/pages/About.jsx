import React, { useEffect, useState } from 'react';
import { ShieldCheck, History, Award, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const [settings, setSettings] = useState(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const isAr = language === 'ar';

  return (
    <div className="about-page container">
      <h1 className="section-title">{t('about.title')}</h1>
      
      {/* Intro section */}
      <div className="about-intro glass-card">
        <p>
          {isAr ? (settings?.welcomeMessage || t('about.welcomeText')) : t('about.welcomeText')}
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid-2 vision-mission-grid">
        <div className="glass-card flex-col-align">
          <Award className="about-card-icon" size={32} />
          <h2>{t('about.ourVision')}</h2>
          <p>
            {isAr ? (settings?.vision || t('about.visionText')) : t('about.visionText')}
          </p>
        </div>

        <div className="glass-card flex-col-align">
          <ShieldCheck className="about-card-icon" size={32} />
          <h2>{t('about.ourMission')}</h2>
          <p>
            {isAr ? (settings?.mission || t('about.missionText')) : t('about.missionText')}
          </p>
        </div>
      </div>

      {/* History and Heritage */}
      <section className="about-section glass-card">
        <div className="section-header">
          <History className="section-icon" size={24} />
          <h2>{t('about.ourHistory')}</h2>
        </div>
        <p>
          {isAr ? (settings?.history || t('about.historyText')) : t('about.historyText')}
        </p>
      </section>

      {/* Pastors and Leadership */}
      <section className="about-section glass-card">
        <div className="section-header">
          <Users className="section-icon" size={24} />
          <h2>{t('about.pastorsSection')}</h2>
        </div>
        <p>
          {isAr ? (settings?.pastorsInfo || t('about.pastorsText')) : t('about.pastorsText')}
        </p>
      </section>

      {/* Core Beliefs */}
      <section className="about-section glass-card">
        <div className="section-header">
          <ShieldCheck className="section-icon" size={24} />
          <h2>{t('about.ourBeliefs')}</h2>
        </div>
        <p style={{ whiteSpace: 'pre-line' }}>
          {isAr ? (settings?.beliefs || t('about.beliefsText')) : t('about.beliefsText')}
        </p>
      </section>

      <style>{`
        .about-page {
          padding-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .about-intro {
          font-size: 1.25rem;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.8;
          border-right: ${isAr ? '4px solid var(--accent-color)' : 'none'};
          border-left: ${isAr ? 'none' : '4px solid var(--accent-color)'};
        }
        .flex-col-align {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }
        .about-card-icon {
          color: var(--accent-color);
        }
        .vision-mission-grid h2 {
          font-size: 1.5rem;
        }
        .vision-mission-grid p {
          color: var(--text-secondary);
        }
        .about-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.75rem;
        }
        .section-icon {
          color: var(--accent-color);
        }
        .about-section p {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
};

export default About;
