const express = require('express');
const router = express.Router();
const { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGalleryItems);
router.post('/', protect, upload.single('galleryFile'), createGalleryItem);
router.put('/:id', protect, upload.single('galleryFile'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
