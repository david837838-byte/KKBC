const mongoose = require('mongoose');

const dailyVerseSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'نص الآية مطلوب'],
    trim: true,
  },
  reference: {
    type: String,
    required: [true, 'مرجع الآية مطلوب'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailyVerseModel = mongoose.model('DailyVerse', dailyVerseSchema);
module.exports = require('../config/dbWrapper')('DailyVerse', DailyVerseModel);
