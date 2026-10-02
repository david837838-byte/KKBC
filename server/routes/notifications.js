const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribersCount,
  sendNotification,
  getVapidPublicKey,
  broadcastDailyVerse
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/vapid-key', getVapidPublicKey);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/count', protect, getSubscribersCount);
router.post('/send', protect, sendNotification);
router.post('/broadcast-daily-verse', broadcastDailyVerse);

module.exports = router;
