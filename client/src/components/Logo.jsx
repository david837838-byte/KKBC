import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Logo = ({ className = "h-12 w-12", showText = true }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', direction: isAr ? 'rtl' : 'ltr' }}>
      {/* Official Church Logo Image */}
      <img 
        src="/logo.png" 
        alt="كنيسة خربة قنافار الإنجيلية" 
        style={{ 
          width: '56px', 
          height: '56px', 
          objectFit: 'contain',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
          border: '2px solid var(--accent-color, #c5a880)',
          background: '#ffffff',
          padding: '2px',
          transition: 'transform 0.3s ease'
        }} 
      />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', textAlign: isAr ? 'right' : 'left' }}>
          <span style={{ 
            fontWeight: '900', 
            fontSize: '1.15rem', 
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-family)',
            letterSpacing: isAr ? '0' : '0.5px'
          }}>
            {isAr ? 'الكنيسة المعمدانية الإنجيلية' : 'Evangelical Baptist Church'}
          </span>
          <span style={{ 
            fontWeight: '700', 
            fontSize: '0.92rem', 
            color: 'var(--accent-color, #c5a880)',
            letterSpacing: isAr ? '0.3px' : '0.8px'
          }}>
            {isAr ? 'خربة قنافار — البقاع الغربي' : 'Khirbet Qanafar — West Bekaa'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
