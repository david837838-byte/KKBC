const express = require('express');
const router = express.Router();
const { recordVisit, getStats } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.post('/record', recordVisit);
router.get('/', protect, getStats);

module.exports = router;
