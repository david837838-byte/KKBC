const Prayer = require('../models/Prayer');

// @desc    Get all prayer requests
// @route   GET /api/prayers
// @access  Private
exports.getPrayers = async (req, res) => {
  try {
    const prayers = await Prayer.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: prayers.length, data: prayers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a prayer request
// @route   POST /api/prayers
// @access  Public
exports.createPrayer = async (req, res) => {
  try {
    const { name, phone, request } = req.body;
    const prayer = await Prayer.create({
      name: name || 'مجهول',
      phone,
      request,
    });

    // Notify admins in the dashboard via Socket.io
    if (req.io) {
      req.io.emit('newPrayerRequest', prayer);
    }

    res.status(201).json({ success: true, data: prayer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark prayer request as read
// @route   PUT /api/prayers/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const prayer = await Prayer.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!prayer) {
      return res.status(404).json({ success: false, message: 'طلبة الصلاة غير موجودة' });
    }

    res.status(200).json({ success: true, data: prayer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete prayer request
// @route   DELETE /api/prayers/:id
// @access  Private
exports.deletePrayer = async (req, res) => {
  try {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) {
      return res.status(404).json({ success: false, message: 'طلبة الصلاة غير موجودة' });
    }

    await Prayer.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف طلبة الصلاة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
