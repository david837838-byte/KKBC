/**
 * Security Middleware: Input Sanitizer for NoSQL Injection & XSS Protection
 */

// Recursive function to strip NoSQL Injection operators (keys starting with '$' or containing '.')
const sanitizeNoSQL = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeNoSQL(item));
  }

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Strip keys starting with '$' or containing '.' (MongoDB operators / object traversal)
    if (key.startsWith('$') || key.includes('.')) {
      console.warn(`🛡️ Security Warning: Stripped suspicious NoSQL key: "${key}"`);
      continue;
    }
    sanitized[key] = sanitizeNoSQL(obj[key]);
  }
  return sanitized;
};

// String sanitizer to clean dangerous HTML/script tags
const sanitizeXSSString = (str) => {
  if (typeof str !== 'string') return str;
  // Replace dangerous script tags and event handlers
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror=/gi, '')
    .replace(/onload=/gi, '');
};

const sanitizeXSS = (obj) => {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return sanitizeXSSString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeXSS(item));
  }
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeXSS(obj[key]);
    }
    return sanitized;
  }
  return obj;
};

/**
 * Express Middleware to sanitize request params, query, and body
 */
const sanitizeInputs = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeXSS(sanitizeNoSQL(req.body));
    }
    if (req.query) {
      req.query = sanitizeXSS(sanitizeNoSQL(req.query));
    }
    if (req.params) {
      req.params = sanitizeXSS(sanitizeNoSQL(req.params));
    }
  } catch (error) {
    console.error('Sanitizer middleware error:', error);
  }
  next();
};

module.exports = sanitizeInputs;
