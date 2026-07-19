const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUsers, deleteUser, updateUser, getLockouts, deleteLockout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiters');

router.post('/register', protect, authorize('admin'), registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);
router.get('/lockouts', protect, authorize('admin'), getLockouts);
router.delete('/lockouts/:id', protect, authorize('admin'), deleteLockout);

module.exports = router;
