const Sermon = require('../models/Sermon');
const fs = require('fs');
const path = require('path');

// Helper to delete local file
const deleteLocalFile = (fileUrl) => {
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    }
  }
};

// @desc    Get all sermons (with search and filtering)
// @route   GET /api/sermons
// @access  Public
exports.getSermons = async (req, res) => {
  try {
    const { search, preacher, category, type } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { preacher: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (preacher) query.preacher = preacher;
    if (category) query.category = category;
    if (type) query.type = type;

    const sermons = await Sermon.find(query).sort({ date: -1 });
    res.status(200).json({ success: true, count: sermons.length, data: sermons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single sermon
// @route   GET /api/sermons/:id
// @access  Public
exports.getSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: 'العظة غير موجودة' });
    }
    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new sermon
// @route   POST /api/sermons
// @access  Private
exports.createSermon = async (req, res) => {
  try {
    const { title, preacher, date, type, url, category, description } = req.body;
    let fileUrl = '';

    if (req.file) {
      fileUrl = `/uploads/sermons/${req.file.filename}`;
    }

    const sermon = await Sermon.create({
      title,
      preacher,
      date,
      type,
      url,
      fileUrl,
      category,
      description,
    });

    res.status(201).json({ success: true, data: sermon });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/sermons/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update sermon
// @route   PUT /api/sermons/:id
// @access  Private
exports.updateSermon = async (req, res) => {
  try {
    let sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: 'العظة غير موجودة' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      // Delete old file if it exists
      deleteLocalFile(sermon.fileUrl);
      updateData.fileUrl = `/uploads/sermons/${req.file.filename}`;
    }

    sermon = await Sermon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: sermon });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/sermons/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
// @access  Private
exports.deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    if (!sermon) {
      return res.status(404).json({ success: false, message: 'العظة غير موجودة' });
    }

    // Delete associated file
    deleteLocalFile(sermon.fileUrl);

    await Sermon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف العظة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
