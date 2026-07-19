const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/chatbotController');

router.post('/', chatWithAI);

module.exports = router;
