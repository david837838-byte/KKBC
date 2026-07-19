const Counseling = require('../models/Counseling');

// @desc    Get all counseling requests
// @route   GET /api/counseling
// @access  Private (Admin/Pastor only)
exports.getCounselings = async (req, res) => {
  try {
    // Extra guard to make sure only admin (Pastor) can view counseling requests
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بعرض طلبات الإرشاد الرعوي.' });
    }

    const requests = await Counseling.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit counseling request
// @route   POST /api/counseling
// @access  Public
exports.createCounseling = async (req, res) => {
  try {
    const { name, phone, email, preferredContact, details } = req.body;

    if (!name || !phone || !details) {
      return res.status(400).json({ success: false, message: 'الرجاء ملء الحقول المطلوبة (الاسم، رقم الهاتف، تفاصيل الطلب).' });
    }

    const request = await Counseling.create({
      name,
      phone,
      email,
      preferredContact: preferredContact || 'phone',
      details
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark counseling request as read
// @route   PUT /api/counseling/:id/read
// @access  Private (Admin/Pastor only)
exports.markAsRead = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل طلبات الإرشاد الرعوي.' });
    }

    let request = await Counseling.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'طلب المشورة غير موجود.' });
    }

    request = await Counseling.findByIdAndUpdate(req.params.id, { isRead: true }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete counseling request
// @route   DELETE /api/counseling/:id
// @access  Private (Admin/Pastor only)
exports.deleteCounseling = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف طلبات الإرشاد الرعوي.' });
    }

    const request = await Counseling.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'طلب المشورة غير موجود.' });
    }

    await Counseling.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف طلب المشورة بنجاح.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
