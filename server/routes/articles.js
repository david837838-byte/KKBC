const express = require('express');
const router = express.Router();
const { getArticles, getArticle, createArticle, updateArticle, deleteArticle } = require('../controllers/articleController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const uploadFields = upload.fields([
  { name: 'articleImage', maxCount: 1 },
  { name: 'articlePdf', maxCount: 1 }
]);

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', protect, uploadFields, createArticle);
router.put('/:id', protect, uploadFields, updateArticle);
router.delete('/:id', protect, deleteArticle);

module.exports = router;
