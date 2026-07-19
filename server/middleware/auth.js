const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ensure JWT_SECRET is set - fail fast if missing
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in environment variables. Server cannot start securely.');
  process.exit(1);
}

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using environment variable only (no hardcoded fallback)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'غير مصرح لك بالوصول، الرمز منتهي أو غير صالح' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'غير مصرح لك بالوصول، لا يوجد رمز مميز' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `المستخدم بالدور (${req.user.role}) غير مصرح له بالقيام بهذا الإجراء`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
