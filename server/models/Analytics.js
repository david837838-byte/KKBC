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
  // Countries Breakdown
  countries: [
    {
      code: { type: String, default: 'LB' },
      name: { type: String, default: 'لبنان' },
      flag: { type: String, default: '🇱🇧' },
      count: { type: Number, default: 0 },
      lastVisit: { type: Date, default: Date.now }
    }
  ],
  // Top Visited Pages
  pages: [
    {
      path: { type: String, default: '/' },
      name: { type: String, default: 'الرئيسية' },
      count: { type: Number, default: 0 }
    }
  ],
  // Devices Breakdown
  devices: {
    mobile: { type: Number, default: 0 },
    desktop: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 }
  },
  // Browsers Breakdown
  browsers: {
    chrome: { type: Number, default: 0 },
    safari: { type: Number, default: 0 },
    firefox: { type: Number, default: 0 },
    edge: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  // Recent Live Activity Stream (last 50 visits)
  recentVisits: [
    {
      country: { type: String, default: 'لبنان' },
      countryCode: { type: String, default: 'LB' },
      flag: { type: String, default: '🇱🇧' },
      city: { type: String, default: 'البقاع' },
      page: { type: String, default: '/' },
      pageName: { type: String, default: 'الرئيسية' },
      device: { type: String, default: 'هاتف' },
      browser: { type: String, default: 'Chrome' },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const AnalyticsModel = mongoose.model('Analytics', analyticsSchema);
module.exports = require('../config/dbWrapper')('Analytics', AnalyticsModel);
