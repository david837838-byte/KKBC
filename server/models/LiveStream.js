const mongoose = require('mongoose');

const liveStreamSchema = new mongoose.Schema({
  isLive: {
    type: Boolean,
    default: false,
  },
  platform: {
    type: String,
    enum: ['youtube', 'facebook', 'other'],
    default: 'youtube',
  },
  url: {
    type: String, // YouTube Live stream URL or Facebook Live stream URL
    trim: true,
  },
  embedCode: {
    type: String, // Optional iframe or direct video ID
    trim: true,
  },
  title: {
    type: String,
    trim: true,
    default: 'البث المباشر للاجتماع المشترك',
  },
  description: {
    type: String,
    trim: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const LiveStreamModel = mongoose.model('LiveStream', liveStreamSchema);
module.exports = require('../config/dbWrapper')('LiveStream', LiveStreamModel);
