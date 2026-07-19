const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

const deleteLocalFile = (url) => {
  if (url && url.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting gallery file: ${filePath}`, err);
      }
    }
  }
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getGalleryItems = async (req, res) => {
  try {
    const { type, category, year } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (year) query.year = Number(year);

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, type, url, category, year } = req.body;
    let finalUrl = url;

    if (req.file) {
      finalUrl = `/uploads/gallery/${req.file.filename}`;
    }

    const item = await Gallery.create({
      title,
      type,
      url: finalUrl,
      category,
      year: Number(year),
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/gallery/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private
exports.updateGalleryItem = async (req, res) => {
  try {
    let item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    const updateData = { ...req.body };
    if (updateData.year) updateData.year = Number(updateData.year);

    if (req.file) {
      deleteLocalFile(item.url);
      updateData.url = `/uploads/gallery/${req.file.filename}`;
    }

    item = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/gallery/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' });
    }

    deleteLocalFile(item.url);

    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم الحذف بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
