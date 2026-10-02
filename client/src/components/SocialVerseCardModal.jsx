import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Image, RefreshCw, Smartphone, Square } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const THEMES = [
  {
    id: 'royal-gold',
    nameAr: 'ملكي أزرق وذهبي',
    nameEn: 'Royal Navy & Gold',
    bgStart: '#090d16',
    bgEnd: '#1e293b',
    border: 'rgba(245, 158, 11, 0.45)',
    gold: '#fbbf24',
    textColor: '#ffffff',
    subText: '#e2e8f0',
    badgeBg: 'rgba(245, 158, 11, 0.18)',
    badgeBorder: '#f59e0b',
    badgeText: '#fef08a'
  },
  {
    id: 'dawn-grace',
    nameAr: 'فجر النعمة والرجاء',
    nameEn: 'Dawn of Grace',
    bgStart: '#2e1065',
    bgEnd: '#701a75',
    border: 'rgba(236, 72, 153, 0.4)',
    gold: '#fde047',
    textColor: '#ffffff',
    subText: '#fae8ff',
    badgeBg: 'rgba(236, 72, 153, 0.22)',
    badgeBorder: '#ec4899',
    badgeText: '#fdf2f8'
  },
  {
    id: 'living-waters',
    nameAr: 'مراعي خضراء وهادئة',
    nameEn: 'Living Waters',
    bgStart: '#022c22',
    bgEnd: '#064e3b',
    border: 'rgba(52, 211, 153, 0.45)',
    gold: '#fcd34d',
    textColor: '#ffffff',
    subText: '#d1fae5',
    badgeBg: 'rgba(16, 185, 129, 0.22)',
    badgeBorder: '#10b981',
    badgeText: '#a7f3d0'
  },
  {
    id: 'serene-light',
    nameAr: 'النور والسلام',
    nameEn: 'Pure Light',
    bgStart: '#fffbeb',
    bgEnd: '#fef3c7',
    border: 'rgba(180, 83, 9, 0.35)',
    gold: '#b45309',
    textColor: '#1e293b',
    subText: '#475569',
    badgeBg: 'rgba(180, 83, 9, 0.12)',
    badgeBorder: '#b45309',
    badgeText: '#92400e'
  }
];

const SocialVerseCardModal = ({ isOpen, onClose, verse }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  
  const [selectedTheme, setSelectedTheme] = useState('royal-gold');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // '1:1' (Square) or '9:16' (Story)
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const canvasRef = useRef(null);

  const currentText = verse?.text || '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»';
  const currentRef = verse?.reference || 'يشوع 24: 15';

  // Helper function to wrap text for canvas
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // Draw card on high-resolution canvas
  const renderCardToCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isStory = aspectRatio === '9:16';
    const width = 1080;
    const height = isStory ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = THEMES.find(t => t.id === selectedTheme) || THEMES[0];

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, theme.bgStart);
    bgGrad.addColorStop(1, theme.bgEnd);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 1.1 Subtle Radial Glow in center
    const radialGlow = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.65);
    radialGlow.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. Ornamental Border
    const padding = 54;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(padding, padding, width - padding * 2, height - padding * 2);

    // Inner subtle thin border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(padding + 12, padding + 12, width - (padding + 12) * 2, height - (padding + 12) * 2);

    // 3. Header: Church Identity
    const headerY = isStory ? 240 : 160;
    ctx.textAlign = 'center';

    // Cross Symbol
    ctx.font = 'bold 50px Arial, sans-serif';
    ctx.fillStyle = theme.gold;
    ctx.fillText('✝', width / 2, headerY - 50);

    // Church Name
    ctx.font = 'bold 36px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillStyle = theme.textColor;
    ctx.fillText('الكنيسة المعمدانية الإنجيلية — خربة قنافار', width / 2, headerY);

    // Subtitle
    ctx.font = '500 24px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillStyle = theme.gold;
    ctx.fillText('آية اليوم المباركة', width / 2, headerY + 44);

    // Divider Line with diamond in middle
    const divY = headerY + 80;
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 180, divY);
    ctx.lineTo(width / 2 - 20, divY);
    ctx.moveTo(width / 2 + 20, divY);
    ctx.lineTo(width / 2 + 180, divY);
    ctx.stroke();

    ctx.fillStyle = theme.gold;
    ctx.beginPath();
    ctx.arc(width / 2, divY, 6, 0, Math.PI * 2);
    ctx.fill();

    // 4. Verse Text (Centerpiece)
    const maxWidth = width - 200;
    let fontSize = isStory ? 52 : 46;
    if (currentText.length > 180) fontSize = isStory ? 44 : 38;
    if (currentText.length > 280) fontSize = isStory ? 38 : 32;

    ctx.font = `bold ${fontSize}px "Amiri", "Traditional Arabic", "Segoe UI", Tahoma, Arial, sans-serif`;
    ctx.fillStyle = theme.textColor;

    const wrappedLines = wrapText(ctx, currentText, maxWidth);
    const lineHeight = fontSize * 1.65;
    const totalTextHeight = wrappedLines.length * lineHeight;

    const startY = (height / 2) - (totalTextHeight / 2) + (isStory ? 40 : 15);

    // Opening quotation mark
    ctx.font = `italic 70px "Georgia", serif`;
    ctx.fillStyle = theme.gold;
    ctx.fillText('«', width / 2, startY - 25);

    // Text Lines
    ctx.font = `bold ${fontSize}px "Amiri", "Traditional Arabic", "Segoe UI", Tahoma, Arial, sans-serif`;
    ctx.fillStyle = theme.textColor;
    wrappedLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * lineHeight) + 20);
    });

    // Closing quotation mark
    ctx.font = `italic 70px "Georgia", serif`;
    ctx.fillStyle = theme.gold;
    ctx.fillText('»', width / 2, startY + (wrappedLines.length * lineHeight) + 35);

    // 5. Reference Badge
    const refY = startY + (wrappedLines.length * lineHeight) + 105;
    ctx.font = 'bold 32px "Segoe UI", Tahoma, Arial, sans-serif';
    const refText = `[ ${currentRef} ]`;
    const refWidth = ctx.measureText(refText).width + 60;
    const refHeight = 56;

    ctx.fillStyle = theme.badgeBg;
    ctx.beginPath();
    ctx.roundRect(width / 2 - refWidth / 2, refY - 38, refWidth, refHeight, 28);
    ctx.fill();

    ctx.strokeStyle = theme.badgeBorder;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = theme.badgeText;
    ctx.fillText(refText, width / 2, refY);

    // 6. Footer (Website Branding)
    const footerY = height - (isStory ? 140 : 95);
    ctx.font = '600 24px "Segoe UI", Tahoma, Arial, sans-serif';
    ctx.fillStyle = theme.subText;
    ctx.fillText('kherbetbaptistchurch.org', width / 2, footerY);

    // Generate preview URL
    try {
      setPreviewUrl(canvas.toDataURL('image/png'));
    } catch (e) {
      console.error('Error generating preview:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderCardToCanvas, 60);
    }
  }, [isOpen, selectedTheme, aspectRatio, currentText, currentRef]);

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `اية-اليوم-${currentRef.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Direct share to WhatsApp / Mobile Sheet
  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSharing(true);

    try {
      const shareText = `"${currentText}" — ${currentRef}\n\nكنيسة خربة قنافار المعمدانية الإنجيلية\nhttps://kherbetbaptistchurch.org`;
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharing(false);
          return;
        }

        const file = new File([blob], 'verse-of-the-day.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: isAr ? 'آية اليوم المباركة' : 'Daily Bible Verse',
            text: shareText,
            files: [file]
          });
        } else if (navigator.share) {
          await navigator.share({
            title: isAr ? 'آية اليوم المباركة' : 'Daily Bible Verse',
            text: shareText,
            url: 'https://kherbetbaptistchurch.org'
          });
        } else {
          // Fallback: download and copy text
          handleDownload();
          navigator.clipboard.writeText(shareText);
          alert(isAr ? 'تم تحميل الصورة ونسخ نص الآية لمشاركتها عبر واتساب!' : 'Image downloaded & text copied to clipboard!');
        }
        setSharing(false);
      }, 'image/png');
    } catch (err) {
      console.log('Share canceled or error:', err);
      setSharing(false);
    }
  };

  const handleCopyText = () => {
    const shareText = `"${currentText}" — ${currentRef}\n\nالكنيسة المعمدانية الإنجيلية — خربة قنافار\nhttps://kherbetbaptistchurch.org`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--card-bg, #111827)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          direction: isAr ? 'rtl' : 'ltr'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Sparkles size={22} color="#f59e0b" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
              {isAr ? 'تصميم ومشاركة بطاقة آية اليوم' : 'Design & Share Daily Verse Card'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary, #94a3b8)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Card Preview Container */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            minHeight: '260px'
          }}>
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Verse Card Preview" 
                style={{
                  maxHeight: aspectRatio === '9:16' ? '360px' : '280px',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
                <RefreshCw size={20} className="spin" />
                <span>{isAr ? 'جاري تجهيز التصميم...' : 'Rendering design...'}</span>
              </div>
            )}
          </div>

          {/* Hidden Canvas for actual rendering */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Format Selector: Square or Story */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary, #cbd5e1)' }}>
              {isAr ? 'مقاس التصميم:' : 'Card Format:'}
            </label>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: aspectRatio === '1:1' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: aspectRatio === '1:1' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: aspectRatio === '1:1' ? '#f59e0b' : 'var(--text-primary, #ffffff)'
                }}
              >
                <Square size={16} />
                <span>{isAr ? 'مربع 1:1 (للمنشورات والمجموعات)' : 'Square 1:1 (Posts/Feed)'}</span>
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: aspectRatio === '9:16' ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: aspectRatio === '9:16' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: aspectRatio === '9:16' ? '#f59e0b' : 'var(--text-primary, #ffffff)'
                }}
              >
                <Smartphone size={16} />
                <span>{isAr ? 'طولي 9:16 (حالات واتساب وستوري)' : 'Story 9:16 (WhatsApp Status)'}</span>
              </button>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-secondary, #cbd5e1)' }}>
              {isAr ? 'اختر النمط الروحي والخلفية:' : 'Select Spiritual Theme:'}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
              {THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme.id)}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: `linear-gradient(135deg, ${theme.bgStart}, ${theme.bgEnd})`,
                      color: theme.id === 'serene-light' ? '#0f172a' : '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: isSelected ? '0 0 12px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{isAr ? theme.nameAr : theme.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          {/* Direct Share (WhatsApp / Social) */}
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="btn btn-primary"
            style={{
              flex: '1 1 180px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: '#25D366',
              borderColor: '#25D366',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '12px'
            }}
          >
            <Share2 size={18} />
            <span>{isAr ? 'مشاركة عبر واتساب / الهاتف' : 'Share to WhatsApp / Phone'}</span>
          </button>

          {/* Download Image */}
          <button
            type="button"
            onClick={handleDownload}
            className="btn"
            style={{
              flex: '1 1 140px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'var(--accent-color, #8b5cf6)',
              borderColor: 'var(--accent-color, #8b5cf6)',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: '12px'
            }}
          >
            <Download size={18} />
            <span>{isAr ? 'تحميل الصورة (HD)' : 'Download Image'}</span>
          </button>

          {/* Copy Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="btn btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
            <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy Text')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default SocialVerseCardModal;
