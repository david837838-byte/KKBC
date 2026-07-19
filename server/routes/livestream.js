const express = require('express');
const router = express.Router();
const { getLiveStreamStatus, updateLiveStreamStatus } = require('../controllers/liveStreamController');
const { protect } = require('../middleware/auth');

router.get('/', getLiveStreamStatus);
router.put('/', protect, updateLiveStreamStatus);

module.exports = router;
