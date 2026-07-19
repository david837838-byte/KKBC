const mongoose = require('mongoose');

const hymnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a hymn title'],
    trim: true,
  },
  lyrics: {
    type: String,
  },
  imageUrl: {
    type: String, // Uploaded hymn image path
  },
  audioUrl: {
    type: String, // Sound link or local audio upload path
  },
  videoUrl: {
    type: String, // Youtube video embed URL
  },
  category: {
    type: String,
    trim: true,
    default: 'عامة',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HymnModel = mongoose.model('Hymn', hymnSchema);
module.exports = require('../config/dbWrapper')('Hymn', HymnModel);
