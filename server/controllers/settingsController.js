const Settings = require('../models/Settings');
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
