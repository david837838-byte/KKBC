const express = require('express');
const router = express.Router();
const { getCounselings, createCounseling, markAsRead, deleteCounseling } = require('../controllers/counselingController');
const { protect } = require('../middleware/auth');
const { submissionLimiter } = require('../middleware/rateLimiters');

router.get('/', protect, getCounselings);
router.post('/', submissionLimiter, createCounseling);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteCounseling);

module.exports = router;
