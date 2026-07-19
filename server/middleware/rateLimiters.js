const rateLimit = require('express-rate-limit');

// General API rate limit: 300 requests per 15 minutes per IP
// Bypasses rate limiting for authenticated requests (e.g. admin requests with token)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.headers.authorization && req.headers.authorization.startsWith('Bearer '),
});

// Strict rate limit for authentication: 30 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'محاولات تسجيل دخول كثيرة جداً. يرجى الانتظار 15 دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chatbot rate limit: 3 messages per minute per IP
const chatbotLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: { success: false, message: 'الرجاء الانتظار قليلاً قبل إرسال رسالة أخرى للمساعد الروحي.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Submission rate limit for prayers/counseling: 3 per hour
const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: 'تم إرسال عدة طلبات بالفعل. يرجى المحاولة لاحقاً.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
  chatbotLimiter,
  submissionLimiter,
};
