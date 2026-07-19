const express = require('express');
const router = express.Router();
const { getPrayers, createPrayer, markAsRead, deletePrayer } = require('../controllers/prayerController');
const { protect } = require('../middleware/auth');
const { submissionLimiter } = require('../middleware/rateLimiters');

router.get('/', protect, getPrayers);
router.post('/', submissionLimiter, createPrayer);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deletePrayer);

module.exports = router;
