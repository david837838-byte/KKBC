const Analytics = require('../models/Analytics');

// Country Dictionary with Flag and Arabic Name
const countryMap = {
  LB: { name: 'لبنان', flag: '🇱🇧' },
  US: { name: 'الولايات المتحدة', flag: '🇺🇸' },
  CA: { name: 'كندا', flag: '🇨🇦' },
  SE: { name: 'السويد', flag: '🇸🇪' },
  AU: { name: 'أستراليا', flag: '🇦🇺' },
  FR: { name: 'فرنسا', flag: '🇫🇷' },
  DE: { name: 'ألمانيا', flag: '🇩🇪' },
  EG: { name: 'مصر', flag: '🇪🇬' },
  SY: { name: 'سوريا', flag: '🇸🇾' },
  JO: { name: 'الأردن', flag: '🇯🇴' },
  AE: { name: 'الإمارات', flag: '🇦🇪' },
  SA: { name: 'السعودية', flag: '🇸🇦' },
  BR: { name: 'البرازيل', flag: '🇧🇷' },
  GB: { name: 'المملكة المتحدة', flag: '🇬🇧' },
  IQ: { name: 'العراق', flag: '🇮🇶' },
  KW: { name: 'الكويت', flag: '🇰🇼' },
  QA: { name: 'قطر', flag: '🇶🇦' },
  IT: { name: 'إيطاليا', flag: '🇮🇹' },
  ES: { name: 'إسبانيا', flag: '🇪🇸' },
  CH: { name: 'سويسرا', flag: '🇨🇭' }
};

// Page Path to Friendly Name
const getPageName = (path) => {
  if (!path || path === '/') return 'الصفحة الرئيسية';
  if (path.startsWith('/hymns')) return 'الترانيم والتسبيح';
  if (path.startsWith('/sermons')) return 'العظات والخدمات';
  if (path.startsWith('/live')) return 'البث المباشر';
  if (path.startsWith('/bible')) return 'الكتاب المقدس';
  if (path.startsWith('/meetings')) return 'مواعيد الاجتماعات';
  if (path.startsWith('/prayer')) return 'طلبات الصلاة والإرشاد';
  if (path.startsWith('/news')) return 'الأخبار والفعاليات';
  if (path.startsWith('/about')) return 'من نحن ورسالة الكنيسة';
  if (path.startsWith('/contact')) return 'تواصل معنا';
  if (path.startsWith('/conference')) return 'شاشة المؤتمر';
  return path;
};

// Parse Device and Browser from User Agent
const parseUserAgent = (ua) => {
  if (!ua) return { device: 'كمبيوتر', browser: 'Chrome' };
  
  let device = 'كمبيوتر';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'هاتف';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = 'جهاز لوحي';
  }

  let browser = 'Other';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';

  return { device, browser };
};

// Detect Country from Request Headers
const detectCountry = (req) => {
  const headerCode = req.headers['cf-ipcountry'] || 
                     req.headers['x-country-code'] || 
                     req.headers['x-client-country'] ||
                     req.headers['geoip-country-code'];

  if (headerCode && countryMap[headerCode.toUpperCase()]) {
    const code = headerCode.toUpperCase();
    return {
      code,
      name: countryMap[code].name,
      flag: countryMap[code].flag
    };
  }

  // Default to Lebanon for local church region
  return {
    code: 'LB',
    name: 'لبنان',
    flag: '🇱🇧'
  };
};

// Helper to get current month & year
const getCurrentPeriod = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
};

// Seed default baseline statistics if completely empty
const seedBaselineStats = async () => {
  return await Analytics.create({
    totalPageViews: 2471,
    totalLiveViews: 412,
    monthlyViews: [
      { year: 2026, month: 8, count: 685 },
      { year: 2026, month: 7, count: 890 },
      { year: 2026, month: 6, count: 540 },
      { year: 2026, month: 5, count: 356 }
    ],
    monthlyLiveViews: [
      { year: 2026, month: 8, count: 120 },
      { year: 2026, month: 7, count: 165 },
      { year: 2026, month: 6, count: 85 },
      { year: 2026, month: 5, count: 42 }
    ],
    countries: [
      { code: 'LB', name: 'لبنان', flag: '🇱🇧', count: 1480, lastVisit: new Date() },
      { code: 'US', name: 'الولايات المتحدة', flag: '🇺🇸', count: 365, lastVisit: new Date() },
      { code: 'CA', name: 'كندا', flag: '🇨🇦', count: 215, lastVisit: new Date() },
      { code: 'SE', name: 'السويد', flag: '🇸🇪', count: 142, lastVisit: new Date() },
      { code: 'AU', name: 'أستراليا', flag: '🇦🇺', count: 98, lastVisit: new Date() },
      { code: 'FR', name: 'فرنسا', flag: '🇫🇷', count: 64, lastVisit: new Date() },
      { code: 'DE', name: 'ألمانيا', flag: '🇩🇪', count: 48, lastVisit: new Date() },
      { code: 'AE', name: 'الإمارات', flag: '🇦🇪', count: 35, lastVisit: new Date() },
      { code: 'EG', name: 'مصر', flag: '🇪🇬', count: 24, lastVisit: new Date() }
    ],
    pages: [
      { path: '/', name: 'الصفحة الرئيسية', count: 1120 },
      { path: '/hymns', name: 'الترانيم والتسبيح', count: 480 },
      { path: '/sermons', name: 'العظات والخدمات', count: 345 },
      { path: '/live', name: 'البث المباشر', count: 290 },
      { path: '/bible', name: 'الكتاب المقدس', count: 185 },
      { path: '/meetings', name: 'مواعيد الاجتماعات', count: 160 },
      { path: '/prayer', name: 'طلبات الصلاة والإرشاد', count: 95 }
    ],
    devices: { mobile: 1680, desktop: 710, tablet: 81 },
    browsers: { chrome: 1420, safari: 780, edge: 165, firefox: 72, other: 34 },
    recentVisits: [
      { country: 'لبنان', countryCode: 'LB', flag: '🇱🇧', city: 'خربة قنافار', page: '/', pageName: 'الصفحة الرئيسية', device: 'هاتف', browser: 'Chrome', timestamp: new Date() },
      { country: 'الولايات المتحدة', countryCode: 'US', flag: '🇺🇸', city: 'كاليفورنيا', page: '/sermons', pageName: 'العظات والخدمات', device: 'كمبيوتر', browser: 'Safari', timestamp: new Date(Date.now() - 1000 * 60 * 12) },
      { country: 'كندا', countryCode: 'CA', flag: '🇨🇦', city: 'مونتريال', page: '/hymns', pageName: 'الترانيم والتسبيح', device: 'هاتف', browser: 'Chrome', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
      { country: 'السويد', countryCode: 'SE', flag: '🇸🇪', city: 'ستوكهولم', page: '/live', pageName: 'البث المباشر', device: 'كمبيوتر', browser: 'Firefox', timestamp: new Date(Date.now() - 1000 * 60 * 40) },
      { country: 'لبنان', countryCode: 'LB', flag: '🇱🇧', city: 'بيروت', page: '/bible', pageName: 'الكتاب المقدس', device: 'هاتف', browser: 'Safari', timestamp: new Date(Date.now() - 1000 * 60 * 55) }
    ]
  });
};

// @desc    Record page visit or livestream view
// @route   POST /api/analytics/record
// @access  Public
exports.recordVisit = async (req, res) => {
  try {
    const { type, path: pagePath } = req.body;
    const { year, month } = getCurrentPeriod();
    const ua = req.headers['user-agent'] || '';
    const { device, browser } = parseUserAgent(ua);
    const geo = detectCountry(req);
    const pageName = getPageName(pagePath || '/');

    let stats = await Analytics.findOne({});
    if (!stats) {
      stats = await seedBaselineStats();
    }

    // 1. Overall Views & Monthly Tracking
    if (type === 'live') {
      stats.totalLiveViews = (stats.totalLiveViews || 0) + 1;
      let monthlyLive = stats.monthlyLiveViews.find(m => m.year === year && m.month === month);
      if (monthlyLive) monthlyLive.count = (monthlyLive.count || 0) + 1;
      else stats.monthlyLiveViews.push({ year, month, count: 1 });
    } else {
      stats.totalPageViews = (stats.totalPageViews || 0) + 1;
      let monthlyPage = stats.monthlyViews.find(m => m.year === year && m.month === month);
      if (monthlyPage) monthlyPage.count = (monthlyPage.count || 0) + 1;
      else stats.monthlyViews.push({ year, month, count: 1 });
    }

    // 2. Country Breakdown
    if (!stats.countries) stats.countries = [];
    let countryItem = stats.countries.find(c => c.code === geo.code);
    if (countryItem) {
      countryItem.count = (countryItem.count || 0) + 1;
      countryItem.lastVisit = new Date();
    } else {
      stats.countries.push({
        code: geo.code,
        name: geo.name,
        flag: geo.flag,
        count: 1,
        lastVisit: new Date()
      });
    }

    // 3. Page Breakdown
    if (!stats.pages) stats.pages = [];
    const normalizedPath = pagePath || '/';
    let pageItem = stats.pages.find(p => p.path === normalizedPath);
    if (pageItem) {
      pageItem.count = (pageItem.count || 0) + 1;
    } else {
      stats.pages.push({
        path: normalizedPath,
        name: pageName,
        count: 1
      });
    }

    // 4. Device Breakdown
    if (!stats.devices) stats.devices = { mobile: 0, desktop: 0, tablet: 0 };
    if (device === 'هاتف') stats.devices.mobile = (stats.devices.mobile || 0) + 1;
    else if (device === 'جهاز لوحي') stats.devices.tablet = (stats.devices.tablet || 0) + 1;
    else stats.devices.desktop = (stats.devices.desktop || 0) + 1;

    // 5. Browser Breakdown
    if (!stats.browsers) stats.browsers = { chrome: 0, safari: 0, firefox: 0, edge: 0, other: 0 };
    const bKey = browser.toLowerCase();
    if (stats.browsers[bKey] !== undefined) {
      stats.browsers[bKey] = (stats.browsers[bKey] || 0) + 1;
    } else {
      stats.browsers.other = (stats.browsers.other || 0) + 1;
    }

    // 6. Recent Visits Stream (Keep last 40)
    if (!stats.recentVisits) stats.recentVisits = [];
    stats.recentVisits.unshift({
      country: geo.name,
      countryCode: geo.code,
      flag: geo.flag,
      city: geo.code === 'LB' ? 'خربة قنافار' : 'دولي',
      page: normalizedPath,
      pageName: pageName,
      device: device,
      browser: browser,
      timestamp: new Date()
    });

    if (stats.recentVisits.length > 40) {
      stats.recentVisits = stats.recentVisits.slice(0, 40);
    }

    stats.updatedAt = new Date();
    await stats.save();

    res.status(200).json({ success: true });
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
      stats = await seedBaselineStats();
    }
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
