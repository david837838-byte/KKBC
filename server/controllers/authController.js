const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const jwt = require('jsonwebtoken');

// Generate Token (JWT_SECRET must be set in .env)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (admin/editor)
// @route   POST /api/auth/register
// @access  Private (Admin only)
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role, canManageExpenses } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role,
      canManageExpenses: !!canManageExpenses
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'بيانات المستخدم غير صالحة' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    // Get client IP address and User-Agent device name
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Device';

    // Check if locked out
    let attemptRecord = await LoginAttempt.findOne({ ip: clientIp });
    
    if (attemptRecord) {
      if (attemptRecord.lockoutUntil && new Date(attemptRecord.lockoutUntil) > new Date()) {
        const remainingTime = Math.ceil((new Date(attemptRecord.lockoutUntil) - new Date()) / (60 * 1000));
        return res.status(403).json({
          success: false,
          message: `تم حظر محاولات الدخول لهذا الجهاز مؤقتاً بسبب تكرار المحاولات الخاطئة. يرجى المحاولة بعد ${remainingTime} دقيقة.`
        });
      }
    }

    // Check for user (find by email or username)
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select('+password');

    if (!user) {
      await recordFailedAttempt(clientIp, userAgent);
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await recordFailedAttempt(clientIp, userAgent);
      return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    // Reset login attempts on successful login
    if (attemptRecord) {
      await LoginAttempt.findByIdAndUpdate(attemptRecord._id, {
        attempts: 0,
        lockoutUntil: null,
        userAgent: userAgent
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to record failed attempts
async function recordFailedAttempt(ip, userAgent) {
  try {
    let attemptRecord = await LoginAttempt.findOne({ ip });
    
    if (!attemptRecord) {
      await LoginAttempt.create({
        ip,
        userAgent,
        attempts: 1
      });
    } else {
      const newAttempts = (attemptRecord.attempts || 0) + 1;
      let lockoutTime = null;
      
      if (newAttempts >= 30) {
        lockoutTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour lockout
      }
      
      await LoginAttempt.findByIdAndUpdate(attemptRecord._id, {
        attempts: newAttempts,
        lockoutUntil: lockoutTime,
        userAgent: userAgent,
        updatedAt: new Date()
      });
    }
  } catch (err) {
    console.error('Error tracking login attempt:', err);
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (admins/editors)
// @route   GET /api/auth/users
// @access  Private (Admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'لا يمكنك حذف حسابك الحالي' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role and permissions
// @route   PUT /api/auth/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, role, canManageExpenses } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    // Prevent demoting self
    if (user._id.toString() === req.user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'لا يمكنك تغيير رتبة حسابك الحالي' });
    }

    // Prepare fields to update
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (canManageExpenses !== undefined) updateData.canManageExpenses = canManageExpenses;

    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: updatedUser, message: 'تم تحديث حساب المسؤول بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all login lockout attempts (blocked devices)
// @route   GET /api/auth/lockouts
// @access  Private (Admin only)
exports.getLockouts = async (req, res) => {
  try {
    const lockouts = await LoginAttempt.find({}).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      data: lockouts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unblock/delete a lockout attempt
// @route   DELETE /api/auth/lockouts/:id
// @access  Private (Admin only)
exports.deleteLockout = async (req, res) => {
  try {
    const record = await LoginAttempt.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'سجل الحظر غير موجود' });
    }
    
    await LoginAttempt.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم فك حظر الجهاز بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
