const express = require('express');
const router = express.Router();
const {
  subscribe,
  unsubscribe,
  getSubscribersCount,
  sendNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/count', protect, getSubscribersCount);
router.post('/send', protect, sendNotification);

module.exports = router;
