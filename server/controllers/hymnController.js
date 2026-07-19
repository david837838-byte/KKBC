const Hymn = require('../models/Hymn');
const path = require('path');
const fs = require('fs');

// Helper to delete local files
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join(__dirname, '..', fileUrl);
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting local file:', err);
  });
};

// Memory store for the currently active hymn presentation
let activePresentationHymn = null;

// @desc    Get all hymns
// @route   GET /api/hymns
// @access  Public
exports.getHymns = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { lyrics: { $regex: search, $options: 'i' } },
      ];
    }

    const hymns = await Hymn.find(query).sort({ title: 1 });
    res.status(200).json({ success: true, count: hymns.length, data: hymns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hymn
// @route   GET /api/hymns/:id
// @access  Public
exports.getHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }
    res.status(200).json({ success: true, data: hymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new hymn
// @route   POST /api/hymns
// @access  Private
exports.createHymn = async (req, res) => {
  try {
    const hymnData = { ...req.body };
    
    if (req.file) {
      hymnData.imageUrl = `/uploads/hymns/${req.file.filename}`;
    }

    const hymn = await Hymn.create(hymnData);
    res.status(201).json({ success: true, data: hymn });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hymn
// @route   PUT /api/hymns/:id
// @access  Private
exports.updateHymn = async (req, res) => {
  try {
    let hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      // Delete old file if existed
      if (hymn.imageUrl) {
        deleteLocalFile(hymn.imageUrl);
      }
      updateData.imageUrl = `/uploads/hymns/${req.file.filename}`;
    }

    hymn = await Hymn.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // If the active presentation hymn is the one being updated, refresh it
    if (activePresentationHymn && activePresentationHymn._id === req.params.id) {
      activePresentationHymn = {
        ...activePresentationHymn,
        ...hymn.toObject()
      };
      req.io.emit('hymnPresentationUpdate', activePresentationHymn);
    }

    res.status(200).json({ success: true, data: hymn });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hymn
// @route   DELETE /api/hymns/:id
// @access  Private
exports.deleteHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }

    // Delete uploaded image file if existed
    if (hymn.imageUrl) {
      deleteLocalFile(hymn.imageUrl);
    }

    // If the active presentation hymn is the one being deleted, clear screen
    if (activePresentationHymn && activePresentationHymn._id === req.params.id) {
      activePresentationHymn = null;
      req.io.emit('hymnPresentationUpdate', null);
    }

    await Hymn.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الترنيمة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current active hymn presentation
// @route   GET /api/hymns/present/active
// @access  Public
exports.getActivePresentationHymn = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: activePresentationHymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set current active hymn presentation
// @route   POST /api/hymns/present/active
// @access  Private
exports.setActivePresentationHymn = async (req, res) => {
  try {
    activePresentationHymn = req.body.hymn; // expect whole hymn object or null
    
    // Broadcast active presentation hymn to all connected sockets
    req.io.emit('hymnPresentationUpdate', activePresentationHymn);
    
    res.status(200).json({ success: true, data: activePresentationHymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
