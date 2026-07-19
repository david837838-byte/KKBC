const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a gallery item title'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: [true, 'Please specify the item type'],
  },
  url: {
    type: String, // Image path or YouTube embed URL
    required: [true, 'Please specify file path or URL'],
  },
  category: {
    type: String, // e.g. Summer Camp (المخيم الصيفي), Youth (اجتماع الشباب), Sunday School (مدارس الأحد)
    required: [true, 'Please specify activity or category'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Please specify the year of the activity'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GalleryModel = mongoose.model('Gallery', gallerySchema);
module.exports = require('../config/dbWrapper')('Gallery', GalleryModel);
