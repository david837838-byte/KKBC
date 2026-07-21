const express = require('express');
const router = express.Router();
const {
  createBackup,
  getBackupsList,
  downloadBackup,
  restoreBackup,
  deleteBackup
} = require('../controllers/backupController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createBackup);
router.get('/list', protect, getBackupsList);
router.get('/download/:filename', protect, downloadBackup);
router.post('/restore/:filename', protect, restoreBackup);
router.delete('/:filename', protect, deleteBackup);

module.exports = router;
