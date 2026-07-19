const Settings = require('../models/Settings');
const User = require('../models/User');
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
const fs = require('fs');
const path = require('path');

const deleteLocalFile = (fileUrl) => {
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting settings file: ${filePath}`, err);
      }
    }
  }
};

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    
    // Increment visitor count
    settings.visitorCount = (settings.visitorCount || 0) + 1;
    await Settings.findByIdAndUpdate(settings._id, { visitorCount: settings.visitorCount });

    // SECURITY: Remove sensitive fields before sending to client
    const sanitizedSettings = typeof settings.toObject === 'function' 
      ? settings.toObject() 
      : { ...settings };
    delete sanitizedSettings.geminiApiKey; // Legacy field - now in .env only
    delete sanitizedSettings.__v;

    res.status(200).json({ success: true, data: sanitizedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }

    const updateData = { ...req.body };

    // Parse boolean fields from FormData
    if (updateData.isChatbotEnabled === 'true') {
      updateData.isChatbotEnabled = true;
    } else if (updateData.isChatbotEnabled === 'false') {
      updateData.isChatbotEnabled = false;
    }

    // Parse array if received as string (sometimes from form data)
    if (typeof updateData.contactPhones === 'string') {
      try {
        updateData.contactPhones = JSON.parse(updateData.contactPhones);
      } catch (e) {
        updateData.contactPhones = updateData.contactPhones.split(',').map(p => p.trim());
      }
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        deleteLocalFile(settings.logo);
        updateData.logo = `/uploads/settings/${req.files.logo[0].filename}`;
      }
      if (req.files.heroImage && req.files.heroImage[0]) {
        deleteLocalFile(settings.heroImageUrl);
        updateData.heroImageUrl = `/uploads/settings/${req.files.heroImage[0].filename}`;
      }
    }

    settings = await Settings.findByIdAndUpdate(settings._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    // Delete newly uploaded files on error
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) deleteLocalFile(`/uploads/settings/${req.files.logo[0].filename}`);
      if (req.files.heroImage && req.files.heroImage[0]) deleteLocalFile(`/uploads/settings/${req.files.heroImage[0].filename}`);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export website database backup (JSON file)
// @route   GET /api/settings/backup
// @access  Private (Admin)
exports.exportBackup = async (req, res) => {
  try {
    const backupData = {
      User: await User.find({}),
      Settings: await Settings.find({}),
      LiveStream: await LiveStream.find({}),
      Meeting: await Meeting.find({}),
      Sermon: await Sermon.find({}),
      News: await News.find({}),
      Hymn: await Hymn.find({}),
      Gallery: await Gallery.find({}),
      Prayer: await Prayer.find({}),
      DailyVerse: await DailyVerse.find({}),
      Expense: await Expense.find({}),
      Counseling: await Counseling.find({}),
      Article: await Article.find({}),
      Analytics: await Analytics.find({})
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=church_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.status(200).send(JSON.stringify(backupData, null, 2));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restore website database backup
// @route   POST /api/settings/restore
// @access  Private (Admin)
exports.importBackup = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, message: 'ملف النسخة الاحتياطية غير صالح أو فارغ.' });
    }

    const backupData = req.body;
    
    // Safety check: verify it contains Settings and User collections
    if (!backupData.Settings || !backupData.User) {
      return res.status(400).json({ success: false, message: 'الملف المرفوع لا يحتوي على بنية البيانات الصحيحة للموقع.' });
    }

    // List of models to restore
    const modelsMap = {
      User,
      Settings,
      LiveStream,
      Meeting,
      Sermon,
      News,
      Hymn,
      Gallery,
      Prayer,
      DailyVerse,
      Expense,
      Counseling,
      Article,
      Analytics
    };

    if (global.useMockDb === true) {
      const dbFile = path.join(__dirname, '..', 'uploads', 'local_db.json');
      const formattedDb = {};
      for (const key in modelsMap) {
        formattedDb[key] = Array.isArray(backupData[key]) ? backupData[key] : [];
      }
      // Preserve LoginAttempt or keep empty
      const existingDb = fs.existsSync(dbFile) ? JSON.parse(fs.readFileSync(dbFile, 'utf8')) : {};
      formattedDb.LoginAttempt = existingDb.LoginAttempt || [];
      
      fs.writeFileSync(dbFile, JSON.stringify(formattedDb, null, 2), 'utf8');
    } else {
      // MongoDB Mode: Delete and insert
      for (const key in modelsMap) {
        const Model = modelsMap[key];
        const dataArray = Array.isArray(backupData[key]) ? backupData[key] : [];
        
        await Model.deleteMany({});
        if (dataArray.length > 0) {
          const cleanedData = dataArray.map(doc => {
            const clean = { ...doc };
            delete clean.__v;
            return clean;
          });
          await Model.create(cleanedData);
        }
      }
    }

    res.status(200).json({ success: true, message: 'تم استعادة البيانات والنسخة الاحتياطية بنجاح!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
