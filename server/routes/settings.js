const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, exportBackup, importBackup } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.get('/backup', protect, exportBackup);
router.post('/restore', protect, importBackup);
router.put(
  '/',
  protect,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
