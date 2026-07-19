const express = require('express');
const router = express.Router();
const { 
  getHymns, 
  getHymn, 
  createHymn, 
  updateHymn, 
  deleteHymn,
  getActivePresentationHymn,
  setActivePresentationHymn
} = require('../controllers/hymnController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getHymns);
router.get('/present/active', getActivePresentationHymn);
router.post('/present/active', protect, setActivePresentationHymn);
router.get('/:id', getHymn);
router.post('/', protect, upload.single('hymnImage'), createHymn);
router.put('/:id', protect, upload.single('hymnImage'), updateHymn);
router.delete('/:id', protect, deleteHymn);

module.exports = router;
