const mongoose = require('mongoose');

const prayerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'مجهول', // Anonymous
  },
  phone: {
    type: String,
    trim: true,
  },
  request: {
    type: String,
    required: [true, 'من فضلك اكتب طلبة الصلاة'],
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PrayerModel = mongoose.model('Prayer', prayerSchema);
module.exports = require('../config/dbWrapper')('Prayer', PrayerModel);
