const express = require('express');
const router = express.Router();
const { getSermons, getSermon, createSermon, updateSermon, deleteSermon } = require('../controllers/sermonController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSermons);
router.get('/:id', getSermon);
router.post('/', protect, upload.single('sermonFile'), createSermon);
router.put('/:id', protect, upload.single('sermonFile'), updateSermon);
router.delete('/:id', protect, deleteSermon);

module.exports = router;
