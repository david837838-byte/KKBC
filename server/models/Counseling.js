const mongoose = require('mongoose');

const counselingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a contact phone number'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  preferredContact: {
    type: String,
    enum: ['whatsapp', 'phone', 'meeting'],
    default: 'phone',
  },
  details: {
    type: String,
    required: [true, 'Please provide details of your counseling request'],
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

const CounselingModel = mongoose.model('Counseling', counselingSchema);
module.exports = require('../config/dbWrapper')('Counseling', CounselingModel);
