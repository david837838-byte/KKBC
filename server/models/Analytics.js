const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // General views
  totalPageViews: {
    type: Number,
    default: 0,
  },
  totalLiveViews: {
    type: Number,
    default: 0,
  },
  // Details by Month
  monthlyViews: [
    {
      year: Number,
      month: Number, // 1-12
      count: { type: Number, default: 0 }
    }
  ],
  monthlyLiveViews: [
    {
      year: Number,
      month: Number, // 1-12
      count: { type: Number, default: 0 }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);
module.exports = require('../config/dbWrapper')('Analytics', AnalyticsModel);
