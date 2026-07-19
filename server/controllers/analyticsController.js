const Analytics = require('../models/Analytics');

// Helper to get current month & year
const getCurrentPeriod = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1 // 1-12
  };
};

// @desc    Record page visit or livestream view
// @route   POST /api/analytics/record
// @access  Public
exports.recordVisit = async (req, res) => {
  try {
    const { type } = req.body; // 'page' or 'live'
    const { year, month } = getCurrentPeriod();

    let stats = await Analytics.findOne({});
    if (!stats) {
      // Create single row for analytics if not exists
      stats = await Analytics.create({
        totalPageViews: 0,
        totalLiveViews: 0,
        monthlyViews: [],
        monthlyLiveViews: []
      });
    }

    if (type === 'live') {
      // 1. Increment total live views
      stats.totalLiveViews = (stats.totalLiveViews || 0) + 1;
      
      // 2. Increment monthly live views
      let monthlyLive = stats.monthlyLiveViews.find(m => m.year === year && m.month === month);
      if (monthlyLive) {
        monthlyLive.count = (monthlyLive.count || 0) + 1;
      } else {
        stats.monthlyLiveViews.push({ year, month, count: 1 });
      }
    } else {
      // 1. Increment total page views
      stats.totalPageViews = (stats.totalPageViews || 0) + 1;

      // 2. Increment monthly page views
      let monthlyPage = stats.monthlyViews.find(m => m.year === year && m.month === month);
      if (monthlyPage) {
        monthlyPage.count = (monthlyPage.count || 0) + 1;
      } else {
        stats.monthlyViews.push({ year, month, count: 1 });
      }
    }

    // Save update
    await Analytics.findByIdAndUpdate(stats._id, {
      totalPageViews: stats.totalPageViews,
      totalLiveViews: stats.totalLiveViews,
      monthlyViews: stats.monthlyViews,
      monthlyLiveViews: stats.monthlyLiveViews
    });

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Error recording analytics:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get analytics statistics
// @route   GET /api/analytics
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    let stats = await Analytics.findOne({});
    if (!stats) {
      stats = await Analytics.create({
        totalPageViews: 0,
        totalLiveViews: 0,
        monthlyViews: [],
        monthlyLiveViews: []
      });
    }
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
