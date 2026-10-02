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

const ENCOURAGING_VERSES = require('../data/encouragingVerses');

// Auto-seed encouraging verses to DB if empty or few
let hasCheckedSeed = false;
const ensureEncouragingVerses = async () => {
  if (hasCheckedSeed) return;
  try {
    const count = await DailyVerse.countDocuments({});
    if (count < ENCOURAGING_VERSES.length) {
      for (const item of ENCOURAGING_VERSES) {
        const exists = await DailyVerse.findOne({ reference: item.reference });
        if (!exists) {
          await DailyVerse.create({
            text: item.text,
            reference: item.reference,
            textEn: item.textEn,
            referenceEn: item.referenceEn
          });
        }
      }
    }
    hasCheckedSeed = true;
  } catch (err) {
    console.error('Error auto-seeding encouraging verses:', err.message);
  }
};

// Initial check
setTimeout(ensureEncouragingVerses, 1500);

// @desc    Get today's verse (Automatic deterministic rotation every day)
// @route   GET /api/daily-verses/today
// @access  Public
exports.getTodayVerse = async (req, res) => {
  try {
    await ensureEncouragingVerses();
    let verses = await DailyVerse.find({});
    if (!verses || verses.length === 0) {
      verses = ENCOURAGING_VERSES;
    }

    // Determine day of the year (automatically changes at midnight local time)
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = Math.abs(dayOfYear) % verses.length;
    res.status(200).json({ success: true, data: verses[index] });
  } catch (error) {
    const dayIndex = Math.abs(new Date().getDate()) % ENCOURAGING_VERSES.length;
    res.status(200).json({ success: true, data: ENCOURAGING_VERSES[dayIndex] });
  }
};

// @desc    Get a random encouraging verse on demand
// @route   GET /api/daily-verses/random
// @access  Public
exports.getRandomVerse = async (req, res) => {
  try {
    let verses = await DailyVerse.find({});
    const pool = verses && verses.length > 0 ? verses : ENCOURAGING_VERSES;
    const randomIndex = Math.floor(Math.random() * pool.length);
    res.status(200).json({ success: true, data: pool[randomIndex] });
  } catch (error) {
    const randomIndex = Math.floor(Math.random() * ENCOURAGING_VERSES.length);
    res.status(200).json({ success: true, data: ENCOURAGING_VERSES[randomIndex] });
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
