import React, { useEffect, useState } from 'react';
import { ShieldCheck, History, Award, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const [settings, setSettings] = useState(null);
  const { t } = useLanguage();

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

  return (
    <div className="about-page container">
      <h1 className="section-title">{t('about.title')}</h1>
      
      {/* Intro section */}
      <div className="about-intro glass-card">
        <p>
          {settings?.welcomeMessage || t('footer.description')}
        </p>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid-2 vision-mission-grid">
        <div className="glass-card flex-col-align">
          <Award className="about-card-icon" size={32} />
          <h2>{t('about.ourVision')}</h2>
          <p>
            {settings?.vision || 
              'رؤيتنا هي أن نكون منارة حية لمحبّة المسيح في منطقة البقاع الغربي، نكرز بإنجيل الخلاص، ونبني كنيسة تنمو روحياً وتتلمذ النفوس لتمجيد اسم الرب.'}
          </p>
        </div>

        <div className="glass-card flex-col-align">
          <ShieldCheck className="about-card-icon" size={32} />
          <h2>{t('about.ourMission')}</h2>
          <p>
            {settings?.mission || 
              'رسالتنا هي تمجيد الله من خلال عبادة مقدسة بالروح والحق، الكرازة الفعّالة بروح الإنجيل، تعليم كلمة الله للنمو والنضوج الروحي، وخدمة احتياجات المجتمع المحلي بمحبة المسيح.'}
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
          {settings?.history || 
            'تأسست الكنيسة المعمدانية الإنجيلية في خربة قنافار لتكون مركزاً للشركة الروحية ونشر رسالة الخلاص وتقديم الدعم والتعليم لمختلف الفئات العمرية في منطقة البقاع.'}
        </p>
      </section>

      {/* Pastors and Leadership */}
      <section className="about-section glass-card">
        <div className="section-header">
          <Users className="section-icon" size={24} />
          <h2>{t('about.pastorsSection')}</h2>
        </div>
        <p>
          {settings?.pastorsInfo || 
            'يخدم الكنيسة بنعمة الله القس الراعي بمساعدة فريق من الأخوة والأخوات الخدام الملتزمين بقيادة فترات العبادة، إلقاء المواعظ الكتابية، رعاية مدارس الأحد للأطفال، وتوجيه فئات الشباب.'}
        </p>
      </section>

      {/* Core Beliefs */}
      <section className="about-section glass-card">
        <div className="section-header">
          <ShieldCheck className="section-icon" size={24} />
          <h2>{t('about.ourBeliefs')}</h2>
        </div>
        <p style={{ whiteSpace: 'pre-line' }}>
          {settings?.beliefs || 
            `نحن نؤمن بالحقائق والأسس الروحية التالية:
            1. الكتاب المقدس: هو كلمة الله الموحى بها والمعصومة عن الخطأ، وهو المرجع الأسمى للإيمان والسلوك اليومي.
            2. الله الواحد: معلن في ثلاثة أقانيم متساوية في الجوهر والقدرة والمجد: الآب، والابن، والروح القدس.
            3. الرب يسوع المسيح: نؤمن بلاهوته الكامل، وبولادته العذراوية، وبموته الكفاري النيابي على الصليب، وبقيامته الجسدية وصعوده وجلوسه عن يمين الآب ومجيئه الثاني المجيد.
            4. الخلاص بالنعمة: نؤمن بأن الخلاص هبة مجانية من الله بالنعمة، يتم بالإيمان الشخصي والتوبة الصادقة بعمل الروح القدس، وليس بالأعمال أو الطقوس.`}
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
          border-right: 4px solid var(--accent-color);
          border-left: 0;
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
