const Meeting = require('../models/Meeting');

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Public
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: meetings.length, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all meetings (including inactive for admin)
// @route   GET /api/meetings/admin
// @access  Private
exports.getAdminMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({}).sort({ order: 1 });
    res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new meeting
// @route   POST /api/meetings
// @access  Private
exports.createMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.create(req.body);
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update meeting
// @route   PUT /api/meetings/:id
// @access  Private
exports.updateMeeting = async (req, res) => {
  try {
    let meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'الاجتماع غير موجود' });
    }

    meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete meeting
// @route   DELETE /api/meetings/:id
// @access  Private
exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'الاجتماع غير موجود' });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الاجتماع بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
