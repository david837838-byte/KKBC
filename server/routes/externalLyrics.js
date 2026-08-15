const express = require('express');
const router = express.Router();
const { searchExternalLyrics, getCommonHymns } = require('../controllers/externalLyricsController');

// Public endpoints
router.get('/search', searchExternalLyrics);
router.get('/common', getCommonHymns);

module.exports = router;
