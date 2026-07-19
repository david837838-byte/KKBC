import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Chatbot = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [chatbotName, setChatbotName] = useState('المساعد الروحي');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Fetch settings to check if chatbot is enabled and load its name
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const s = data.data;
          setIsEnabled(s.isChatbotEnabled !== false);
          setChatbotName(s.chatbotName || 'المساعد الروحي للكنيسة');
          
          // Initial greeting message
          setMessages([
            {
              sender: 'bot',
              text: `أهلاً بك! أنا "${s.chatbotName || 'المساعد الروحي للكنيسة'}". يسعدني جداً الإجابة على أسئلتك وتأملاتك من الكتاب المقدس ومشاركتك آيات مشجعة. كيف يمكنني مساعدتك روحياً اليوم؟`
            }
          ]);
        }
      })
      .catch(err => console.error('Error fetching chatbot settings:', err));
  }, []);

  // Scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // If chatbot is disabled or we are in the admin dashboard / login, do not show the widget
  const isHiddenRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login');
  if (!isEnabled || isHiddenRoute) {
    return null;
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        })
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data.reply) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            sender: 'bot', 
            text: 'عذراً، واجهت مشكلة في الاتصال. يمكنك المحاولة مجدداً أو استشارة راعي الكنيسة مباشرة.' 
          }
        ]);
      }
    } catch (err) {
      console.error('Error talking to chatbot:', err);
      setLoading(false);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'bot', 
          text: 'حدث خطأ في الاتصال بالشبكة. يرجى المحاولة بعد قليل.' 
        }
      ]);
    }
  };

  return (
    <div className="chatbot-widget-container" dir="rtl">
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          className="chatbot-float-btn pulse-effect" 
          onClick={() => setIsOpen(true)}
          title="تحدث مع المساعد الروحي الذكي"
        >
          <MessageCircle size={28} />
          <span className="chatbot-badge">AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-card animate-slide-up">
          {/* Chat Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-container">
                <Sparkles size={16} className="chatbot-sparkle-icon" />
              </div>
              <div>
                <h4>{chatbotName}</h4>
                <div className="chatbot-status">
                  <span className="chatbot-status-dot"></span>
                  <span>متصل الآن بالذكاء الاصطناعي</span>
                </div>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chatbot-msg-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
              >
                <div className="chatbot-msg-bubble">
                  {msg.text.split('\n').map((line, lIdx) => (
                    <p key={lIdx} style={{ margin: 0, minHeight: '1.2em' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="chatbot-msg-row bot-row">
                <div className="chatbot-msg-bubble loading-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Footer */}
          <form className="chatbot-footer" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل عن الكتاب المقدس أو اطلب آية مشجعة..."
              className="chatbot-input"
              maxLength={400}
            />
            <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || loading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Styled inline vanilla CSS for premium design and flexibility */}
      <style>{`
        .chatbot-widget-container {
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 10000;
          font-family: inherit;
        }

        .chatbot-float-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark, #0b1a30) 100%);
          color: white;
          border: 2px solid var(--accent-color, #c5a880);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .chatbot-float-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }

        .chatbot-badge {
          position: absolute;
          top: -2px;
          left: -2px;
          background-color: var(--accent-color, #c5a880);
          color: var(--primary-color, #0f2343);
          font-size: 0.65rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          border: 1px solid white;
        }

        .chatbot-window {
          width: 380px;
          height: 520px;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: var(--glass-card-bg, rgba(255, 255, 255, 0.9));
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        /* Dark mode overrides for glass window */
        [data-theme="dark"] .chatbot-window {
          background: var(--glass-card-bg, rgba(15, 35, 67, 0.95));
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chatbot-header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark, #0b1a30) 100%);
          color: white;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--accent-color, #c5a880);
        }

        .chatbot-header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .chatbot-avatar-container {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: rgba(197, 168, 128, 0.2);
          border: 1px solid var(--accent-color, #c5a880);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-sparkle-icon {
          color: var(--accent-color, #c5a880);
          animation: spin-slow 8s linear infinite;
        }

        .chatbot-header h4 {
          margin: 0;
          font-size: 1rem;
          font-weight: bold;
        }

        .chatbot-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .chatbot-status-dot {
          width: 8px;
          height: 8px;
          background-color: #4caf50;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px #4caf50;
        }

        .chatbot-close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .chatbot-close-btn:hover {
          opacity: 1;
        }

        .chatbot-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: rgba(255, 255, 255, 0.03);
        }

        .chatbot-msg-row {
          display: flex;
          width: 100%;
        }

        .chatbot-msg-row.user-row {
          justify-content: flex-end;
        }

        .chatbot-msg-row.bot-row {
          justify-content: flex-start;
        }

        .chatbot-msg-bubble {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.45;
          white-space: pre-wrap;
          word-break: break-word;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .user-row .chatbot-msg-bubble {
          background-color: var(--primary-color);
          color: white;
          border-top-left-radius: 2px;
          border: 1px solid rgba(255,255,255,0.05);
        }

        [data-theme="dark"] .user-row .chatbot-msg-bubble {
          background-color: var(--accent-color);
          color: var(--primary-color);
          font-weight: bold;
        }

        .bot-row .chatbot-msg-bubble {
          background-color: rgba(197, 168, 128, 0.12);
          color: var(--text-color, #333);
          border-top-right-radius: 2px;
          border: 1px solid rgba(197, 168, 128, 0.2);
        }

        [data-theme="dark"] .bot-row .chatbot-msg-bubble {
          background-color: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .loading-bubble {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.75rem 1.25rem;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: var(--text-secondary, #666);
          border-radius: 50%;
          opacity: 0.4;
          animation: typing 1.4s infinite both;
        }

        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        .chatbot-footer {
          padding: 0.75rem;
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background-color: var(--glass-card-bg);
        }

        [data-theme="dark"] .chatbot-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chatbot-input {
          flex: 1;
          padding: 0.6rem 1rem;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
          outline: none;
          color: var(--text-color);
          transition: border-color 0.2s;
        }

        [data-theme="dark"] .chatbot-input {
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(0, 0, 0, 0.3);
        }

        .chatbot-input:focus {
          border-color: var(--accent-color);
        }

        .chatbot-send-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        [data-theme="dark"] .chatbot-send-btn {
          background-color: var(--accent-color);
          color: var(--primary-color);
        }

        .chatbot-send-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .chatbot-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Animations */
        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .pulse-effect {
          box-shadow: 0 0 0 0 rgba(197, 168, 128, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(197, 168, 128, 0.7), 0 8px 24px rgba(0,0,0,0.2);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(197, 168, 128, 0), 0 8px 24px rgba(0,0,0,0.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(197, 168, 128, 0), 0 8px 24px rgba(0,0,0,0.2);
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .chatbot-widget-container {
            bottom: 15px;
            right: 15px;
          }
          .chatbot-window {
            width: calc(100vw - 30px);
            height: 480px;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
