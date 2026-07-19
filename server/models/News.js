const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  imageUrl: {
    type: String, // URL of uploaded image
  },
  category: {
    type: String,
    enum: ['news', 'announcement', 'event'],
    default: 'news',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsModel = mongoose.model('News', newsSchema);
module.exports = require('../config/dbWrapper')('News', NewsModel);
