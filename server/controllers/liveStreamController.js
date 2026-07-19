const LiveStream = require('../models/LiveStream');

// @desc    Get live stream status
// @route   GET /api/livestream
// @access  Public
exports.getLiveStreamStatus = async (req, res) => {
  try {
    let status = await LiveStream.findOne({});
    if (!status) {
      status = await LiveStream.create({
        isLive: false,
        platform: 'youtube',
        url: '',
        title: 'البث المباشر للاجتماع المشترك',
      });
    }
    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update live stream status (Toggle)
// @route   PUT /api/livestream
// @access  Private
exports.updateLiveStreamStatus = async (req, res) => {
  try {
    let status = await LiveStream.findOne({});
    if (!status) {
      status = await LiveStream.create(req.body);
    } else {
      status = await LiveStream.findByIdAndUpdate(status._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    // Broadcast the update to all connected clients via Socket.io
    if (req.io) {
      req.io.emit('liveStreamUpdate', status);
    }

    res.status(200).json({ success: true, data: status });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
