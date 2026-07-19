const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an article title'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Please add the article content'],
  },
  author: {
    type: String,
    trim: true,
    default: 'القس الراعي',
  },
  category: {
    type: String,
    trim: true,
    default: 'مقالات روحية',
  },
  imageUrl: {
    type: String, // Optional path to article banner image
  },
  pdfUrl: {
    type: String, // Optional path to study PDF attachment
  },
  readTime: {
    type: Number, // In minutes
    default: 2,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ArticleModel = mongoose.model('Article', articleSchema);
module.exports = require('../config/dbWrapper')('Article', ArticleModel);
