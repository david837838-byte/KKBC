const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a meeting title'],
    trim: true,
  },
  day: {
    type: String, // e.g. Sunday, Monday (Arabic: الأحد، الإثنين)
    required: [true, 'Please specify the day of the week'],
  },
  time: {
    type: String, // e.g. 18:00 (Arabic: 6:00 مساءً)
    required: [true, 'Please specify the time'],
  },
  description: {
    type: String,
    trim: true,
  },
  location: {
    type: String, // e.g. Church Hall (قاعة الكنيسة)
    default: 'الكنيسة',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingModel = mongoose.model('Meeting', meetingSchema);
module.exports = require('../config/dbWrapper')('Meeting', MeetingModel);
