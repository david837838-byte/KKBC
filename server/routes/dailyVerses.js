const express = require('express');
const router = express.Router();
const { getDailyVerses, getTodayVerse, getRandomVerse, createDailyVerse, updateDailyVerse, deleteDailyVerse } = require('../controllers/dailyVerseController');
const { protect } = require('../middleware/auth');

router.get('/today', getTodayVerse);
router.get('/random', getRandomVerse);
router.get('/', protect, getDailyVerses);
router.post('/', protect, createDailyVerse);
router.put('/:id', protect, updateDailyVerse);
router.delete('/:id', protect, deleteDailyVerse);

module.exports = router;
