import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Logo = ({ className = "h-12 w-12", showText = true }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', direction: isAr ? 'rtl' : 'ltr' }}>
      {/* Official Church Logo Image */}
      <img 
        src="/logo.png" 
        alt="كنيسة خربة قنافار الإنجيلية" 
        style={{ 
          width: '46px', 
          height: '46px', 
          objectFit: 'contain',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          border: '1px solid var(--border-color)',
          background: '#fcfbf7'
        }} 
      />

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2', textAlign: isAr ? 'right' : 'left' }}>
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.05rem', 
            color: 'var(--primary-color)',
            fontFamily: 'var(--font-family)'
          }}>
            {isAr ? 'الكنيسة المعمدانية الإنجيلية' : 'Evangelical Baptist Church'}
          </span>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '0.85rem', 
            color: 'var(--accent-color)',
            letterSpacing: isAr ? '0' : '0.5px'
          }}>
            {isAr ? 'خربة قنافار' : 'Khirbet Qanafar'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
