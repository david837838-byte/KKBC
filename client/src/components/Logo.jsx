import React from 'react';

const Logo = ({ className = "h-12 w-12", showText = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', direction: 'rtl' }}>
      {/* SVG Icon representing the Church Logo */}
      <svg 
        viewBox="0 0 200 200" 
        width="50" 
        height="50" 
        style={{ 
          background: 'white', 
          borderRadius: '50%', 
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-color)',
          padding: '2px'
        }}
      >
        {/* Outer Circle */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="#1a365d" strokeWidth="2" />
        
        {/* Tree Silhouette (representing the tree in the logo) */}
        <path 
          d="M60,110 C50,90 60,70 80,65 C85,50 105,45 120,55 C135,50 145,65 140,80 C150,90 145,110 130,115 C115,120 85,120 60,110 Z" 
          fill="#1b4332" 
          opacity="0.85"
        />
        
        {/* Tree Trunk */}
        <rect x="97" y="100" width="6" height="25" fill="#5c4033" />

        {/* Open Bible at the bottom */}
        <path 
          d="M 60,135 Q 80,125 100,135 Q 120,125 140,135 L 140,145 Q 120,135 100,145 Q 80,135 60,145 Z" 
          fill="#f8f9fa" 
          stroke="#000" 
          strokeWidth="1.5" 
        />
        <path d="M 100,135 L 100,145" stroke="#000" strokeWidth="1" /> {/* Center line of Bible */}

        {/* Holy Cross in the middle, in front of the tree */}
        <rect x="96" y="70" width="8" height="50" fill="#c5a880" rx="1" />
        <rect x="84" y="82" width="32" height="8" fill="#c5a880" rx="1" />
        
        {/* Extra small cross details */}
        <rect x="98" y="72" width="4" height="46" fill="#f8fafc" opacity="0.3" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.1rem', 
            color: 'var(--primary-color)',
            fontFamily: 'var(--font-family)'
          }}>
            الكنيسة المعمدانية الإنجيلية
          </span>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '0.85rem', 
            color: 'var(--accent-color)',
            letterSpacing: '0.5px'
          }}>
            خربة قنافار
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
