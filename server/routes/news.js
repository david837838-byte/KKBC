const express = require('express');
const router = express.Router();
const { getAllNews, getNewsDetails, createNews, updateNews, deleteNews } = require('../controllers/newsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllNews);
router.get('/:id', getNewsDetails);
router.post('/', protect, upload.single('newsImage'), createNews);
router.put('/:id', protect, upload.single('newsImage'), updateNews);
router.delete('/:id', protect, deleteNews);

module.exports = router;
