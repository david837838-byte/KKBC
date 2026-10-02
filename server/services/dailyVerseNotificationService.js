const cron = require('node-cron');
const DailyVerse = require('../models/DailyVerse');
const Settings = require('../models/Settings');
const ENCOURAGING_VERSES = require('../data/encouragingVerses');
const { broadcastPushNotification } = require('./webPushService');

/**
 * Deterministically get today's verse according to the day of the year
 */
const getTodayVerseData = async () => {
  try {
    let verses = await DailyVerse.find({});
    if (!verses || verses.length === 0) {
      verses = ENCOURAGING_VERSES;
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const index = Math.abs(dayOfYear) % verses.length;
    return verses[index] || ENCOURAGING_VERSES[0];
  } catch (err) {
    const dayIndex = Math.abs(new Date().getDate()) % ENCOURAGING_VERSES.length;
    return ENCOURAGING_VERSES[dayIndex];
  }
};

/**
 * Check if today's verse notification has been sent; if not (or forced), send it to all devices
 * @param {Object} io Socket.io instance
 * @param {Boolean} force If true, bypass already-sent check
 */
const checkAndSendDailyVerseNotification = async (io = null, force = false) => {
  try {
    // Current date in YYYY-MM-DD (Beirut / local timezone)
    let todayStr;
    try {
      todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Beirut' }).format(new Date());
    } catch (e) {
      todayStr = new Date().toISOString().split('T')[0];
    }

    // Retrieve settings document
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }

    // If already sent today and not forced, skip
    if (!force && settings.lastDailyVerseNotifiedDate === todayStr) {
      console.log(`ℹ️ [DailyVerseNotification] Verse notification for ${todayStr} has already been sent today.`);
      return {
        status: 'already_sent',
        date: todayStr,
        message: `تم إرسال إشعار آية اليوم (${todayStr}) مسبقاً`
      };
    }

    // Fetch today's verse
    const verse = await getTodayVerseData();
    if (!verse || !verse.text) {
      console.warn('⚠️ [DailyVerseNotification] No verse text available to send.');
      return { status: 'error', message: 'No verse data available' };
    }

    console.log(`📖 [DailyVerseNotification] Preparing broadcast for ${todayStr}: «${verse.reference}»`);

    const payload = {
      title: `📖 آية اليوم المباركة — ${verse.reference}`,
      message: `${verse.text}`,
      body: `${verse.text}`,
      url: '/?tab=verse',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: `daily-verse-${todayStr}`,
      data: {
        type: 'daily-verse',
        date: todayStr,
        reference: verse.reference,
        url: '/?tab=verse'
      }
    };

    // Broadcast to all W3C Web Push subscribers & Socket.io connected devices
    const broadcastResult = await broadcastPushNotification(payload, io);

    // Save date record to DB so duplicate notifications are prevented
    settings.lastDailyVerseNotifiedDate = todayStr;
    await settings.save();

    console.log(`✅ [DailyVerseNotification] Successfully broadcasted today's verse (${todayStr}) to all devices!`);

    return {
      status: 'sent',
      date: todayStr,
      verse: {
        text: verse.text,
        reference: verse.reference
      },
      broadcastResult
    };
  } catch (error) {
    console.error('❌ [DailyVerseNotification] Error in checkAndSendDailyVerseNotification:', error);
    return {
      status: 'error',
      message: error.message
    };
  }
};

/**
 * Initialize automatic daily verse notification scheduler
 * @param {Object} io Socket.io instance
 */
const initDailyVerseNotificationCron = (io = null) => {
  console.log('⏳ Initializing Daily Verse Push Notification Scheduler...');

  // 1. Scheduled run at 00:01 AM every day (immediately when day changes)
  cron.schedule('1 0 * * *', () => {
    console.log('⏰ [DailyVerseCron] Midnight trigger: checking new daily verse notification...');
    checkAndSendDailyVerseNotification(io, false);
  }, {
    timezone: 'Asia/Beirut'
  });

  // 2. Scheduled run at 07:00 AM every morning (for morning devotion)
  cron.schedule('0 7 * * *', () => {
    console.log('⏰ [DailyVerseCron] 07:00 AM morning trigger: verifying daily verse delivery...');
    checkAndSendDailyVerseNotification(io, false);
  }, {
    timezone: 'Asia/Beirut'
  });

  // 3. Periodic hourly sanity check (ensures delivery if server restarted or was sleeping at midnight)
  cron.schedule('0 * * * *', () => {
    checkAndSendDailyVerseNotification(io, false);
  });

  // 4. Initial check 5 seconds after server startup
  setTimeout(() => {
    console.log('🚀 [DailyVerseCron] Startup check: checking if today\'s verse has been notified...');
    checkAndSendDailyVerseNotification(io, false);
  }, 5000);
};

module.exports = {
  getTodayVerseData,
  checkAndSendDailyVerseNotification,
  initDailyVerseNotificationCron
};
