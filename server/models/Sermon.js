const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a sermon title'],
    trim: true,
  },
  preacher: {
    type: String,
    required: [true, 'Please add the preacher name'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please add the sermon date'],
  },
  type: {
    type: String,
    enum: ['video', 'audio', 'pdf', 'link'],
    required: [true, 'Please specify the media type'],
  },
  url: {
    type: String, // YouTube URL, audio streaming link, or external source
    trim: true,
  },
  fileUrl: {
    type: String, // Path to local uploaded file (e.g. /uploads/sermons/file.mp3 or .pdf)
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SermonModel = mongoose.model('Sermon', sermonSchema);
module.exports = require('../config/dbWrapper')('Sermon', SermonModel);
