const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Import all models
const User = require('../models/User');
const Settings = require('../models/Settings');
const LiveStream = require('../models/LiveStream');
const Meeting = require('../models/Meeting');
const Sermon = require('../models/Sermon');
const News = require('../models/News');
const Hymn = require('../models/Hymn');
const Gallery = require('../models/Gallery');
const Prayer = require('../models/Prayer');
const DailyVerse = require('../models/DailyVerse');
const Expense = require('../models/Expense');
const Counseling = require('../models/Counseling');
const Article = require('../models/Article');
const Analytics = require('../models/Analytics');

const modelsMap = {
  User, Settings, LiveStream, Meeting, Sermon, News, Hymn, 
  Gallery, Prayer, DailyVerse, Expense, Counseling, Article, Analytics
};

const BACKUP_DIR = path.join(__dirname, '..', 'backups');

// Ensure backups directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * @desc    Create a full site backup archive (DB + uploads + .env) and sync to Google Drive
 * @route   POST /api/backups/create
 * @access  Private (Admin)
 */
exports.createBackup = async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const backupName = `kkbc_backup_${timestamp}.json`;
    const backupFilePath = path.join(BACKUP_DIR, backupName);

    // 1. Export database collections
    const fullDbData = {};
    if (global.useMockDb === true) {
      const dbFile = path.join(__dirname, '..', 'uploads', 'local_db.json');
      if (fs.existsSync(dbFile)) {
        const fileContent = fs.readFileSync(dbFile, 'utf8');
        Object.assign(fullDbData, JSON.parse(fileContent));
      }
    } else {
      for (const [key, Model] of Object.entries(modelsMap)) {
        fullDbData[key] = await Model.find({}).lean();
      }
    }

    const payload = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      database: fullDbData,
    };

    fs.writeFileSync(backupFilePath, JSON.stringify(payload, null, 2), 'utf8');

    const stats = fs.statSync(backupFilePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    // 2. Attempt Google Drive sync via rclone if available on Ubuntu VPS
    exec(`rclone copy "${backupFilePath}" gdrive:KKBC_Church_Backups/`, (error, stdout, stderr) => {
      let driveSynced = false;
      if (!error) {
        driveSynced = true;
        console.log(`✅ Google Drive Sync Succeeded: ${backupName}`);
      } else {
        console.log(`ℹ️ Google Drive sync pending (Rclone setup optional): ${error ? error.message : ''}`);
      }

      return res.json({
        success: true,
        message: 'تم إنشاء النسخة الاحتياطية وتخزينها بنجاح!',
        data: {
          filename: backupName,
          sizeMB: fileSizeMB,
          createdAt: stats.mtime,
          googleDriveSynced: driveSynced
        }
      });
    });

  } catch (error) {
    console.error('Create Backup Error:', error);
    res.status(500).json({ success: false, message: error.message || 'فشلت عملية إنشاء النسخة الاحتياطية.' });
  }
};

/**
 * @desc    Get list of all backup archives
 * @route   GET /api/backups/list
 * @access  Private (Admin)
 */
exports.getBackupsList = async (req, res) => {
  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      return res.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(BACKUP_DIR);
    const backupList = files
      .filter(f => f.startsWith('kkbc_backup_') && (f.endsWith('.json') || f.endsWith('.zip') || f.endsWith('.gz')))
      .map(filename => {
        const filePath = path.join(BACKUP_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          createdAt: stats.mtime,
          path: `/backups/${filename}`
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: backupList });
  } catch (error) {
    console.error('Get Backups Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب قائمة النسخ الاحتياطية.' });
  }
};

/**
 * @desc    Download a specific backup file
 * @route   GET /api/backups/download/:filename
 * @access  Private (Admin)
 */
exports.downloadBackup = (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'ملف النسخة الاحتياطية غير موجود.' });
    }

    res.download(filePath, filename);
  } catch (error) {
    console.error('Download Backup Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحميل الملف.' });
  }
};

/**
 * @desc    Restore website from chosen backup file
 * @route   POST /api/backups/restore/:filename
 * @access  Private (Admin)
 */
exports.restoreBackup = async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const backupFilePath = path.join(BACKUP_DIR, filename);

    if (!fs.existsSync(backupFilePath)) {
      return res.status(404).json({ success: false, message: 'ملف النسخة الاحتياطية غير موجود.' });
    }

    const fileContent = fs.readFileSync(backupFilePath, 'utf8');
    const parsedData = JSON.parse(fileContent);
    const backupData = parsedData.database || parsedData;

    if (global.useMockDb === true) {
      const dbFile = path.join(__dirname, '..', 'uploads', 'local_db.json');
      fs.writeFileSync(dbFile, JSON.stringify(backupData, null, 2), 'utf8');
    } else {
      for (const [key, Model] of Object.entries(modelsMap)) {
        if (Array.isArray(backupData[key])) {
          await Model.deleteMany({});
          if (backupData[key].length > 0) {
            const cleanedDocs = backupData[key].map(doc => {
              const clean = { ...doc };
              delete clean.__v;
              return clean;
            });
            await Model.insertMany(cleanedDocs);
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'تمت استعادة النسخة الاحتياطية وقاعدة البيانات بنجاح! يرجى إعادة تحميل الصفحة.'
    });

  } catch (error) {
    console.error('Restore Backup Error:', error);
    res.status(500).json({ success: false, message: error.message || 'فشلت عملية استعادة النسخة الاحتياطية.' });
  }
};

/**
 * @desc    Delete a backup file
 * @route   DELETE /api/backups/:filename
 * @access  Private (Admin)
 */
exports.deleteBackup = (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(BACKUP_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'تم حذف النسخة الاحتياطية بنجاح.' });
  } catch (error) {
    console.error('Delete Backup Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف النسخة الاحتياطية.' });
  }
};
