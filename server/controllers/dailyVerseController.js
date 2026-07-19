const DailyVerse = require('../models/DailyVerse');

// @desc    Get all daily verses
// @route   GET /api/daily-verses
// @access  Private (Admin/Editor)
exports.getDailyVerses = async (req, res) => {
  try {
    const verses = await DailyVerse.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: verses.length, data: verses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get today's verse (Deterministic based on day of year)
// @route   GET /api/daily-verses/today
// @access  Public
exports.getTodayVerse = async (req, res) => {
  try {
    const verses = await DailyVerse.find({});
    if (verses.length === 0) {
      // Fallback verse if DB is empty
      return res.status(200).json({ 
        success: true, 
        data: {
          text: '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»',
          reference: 'يشوع 24: 15'
        }
      });
    }

    // Determine day of the year to pick a stable daily verse
    const start = new Date(new Date().getFullYear(), 0, 0);
    const diff = new Date() - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = dayOfYear % verses.length;
    res.status(200).json({ success: true, data: verses[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a daily verse
// @route   POST /api/daily-verses
// @access  Private (Admin/Editor)
exports.createDailyVerse = async (req, res) => {
  try {
    const { text, reference } = req.body;
    if (!text || !reference) {
      return res.status(400).json({ success: false, message: 'يرجى تقديم نص الآية والمرجع' });
    }

    const verse = await DailyVerse.create({ text, reference });
    res.status(201).json({ success: true, data: verse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a daily verse
// @route   PUT /api/daily-verses/:id
// @access  Private (Admin/Editor)
exports.updateDailyVerse = async (req, res) => {
  try {
    const { text, reference } = req.body;
    const verse = await DailyVerse.findByIdAndUpdate(
      req.params.id,
      { text, reference },
      { new: true }
    );

    if (!verse) {
      return res.status(404).json({ success: false, message: 'الآية غير موجودة' });
    }

    res.status(200).json({ success: true, data: verse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a daily verse
// @route   DELETE /api/daily-verses/:id
// @access  Private (Admin/Editor)
exports.deleteDailyVerse = async (req, res) => {
  try {
    const verse = await DailyVerse.findById(req.params.id);
    if (!verse) {
      return res.status(404).json({ success: false, message: 'الآية غير موجودة' });
    }

    await DailyVerse.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الآية بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
