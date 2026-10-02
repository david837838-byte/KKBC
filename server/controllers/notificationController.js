const NotificationSubscription = require('../models/NotificationSubscription');
const { getPublicKey, broadcastPushNotification } = require('../services/webPushService');
const { getTodayVerseData, checkAndSendDailyVerseNotification } = require('../services/dailyVerseNotificationService');

/**
 * @desc    Get VAPID Public Key for client push subscription
 * @route   GET /api/notifications/vapid-key
 * @access  Public
 */
exports.getVapidPublicKey = async (req, res) => {
  try {
    const key = getPublicKey();
    res.status(200).json({ success: true, publicKey: key });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Subscribe a device/browser to push notifications
 * @route   POST /api/notifications/subscribe
 * @access  Public
 */
exports.subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint required' });
    }

    // Check if subscription already exists
    let subscription = await NotificationSubscription.findOne({ endpoint });

    if (!subscription) {
      subscription = await NotificationSubscription.create({
        endpoint,
        keys: keys || {},
        userAgent: req.headers['user-agent'] || ''
      });
      console.log(`📱 New device registered for push notifications (${subscription._id})`);
    } else if (keys && (keys.p256dh || keys.auth)) {
      subscription.keys = keys;
      await subscription.save();
    }

    res.status(201).json({ success: true, message: 'تم الاشتراك في التنبيهات بنجاح!' });
  } catch (error) {
    console.error('Subscribe Notification Error:', error);
    res.status(500).json({ success: false, message: 'فشلت عملية الاشتراك في التنبيهات' });
  }
};

/**
 * @desc    Unsubscribe a device/browser from push notifications
 * @route   POST /api/notifications/unsubscribe
 * @access  Public
 */
exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (endpoint) {
      await NotificationSubscription.deleteOne({ endpoint });
    }
    res.status(200).json({ success: true, message: 'تم إلغاء الاشتراك في التنبيهات' });
  } catch (error) {
    console.error('Unsubscribe Notification Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إلغاء الاشتراك' });
  }
};

/**
 * @desc    Get total count of active subscribed devices
 * @route   GET /api/notifications/count
 * @access  Private (Admin)
 */
exports.getSubscribersCount = async (req, res) => {
  try {
    const count = await NotificationSubscription.countDocuments({});
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, count: 0 });
  }
};

/**
 * @desc    Send push notification to all subscribers
 * @route   POST /api/notifications/send
 * @access  Private (Admin)
 */
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, url, icon } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'عنوان التنبيه ونص الرسالة مطلوبان' });
    }

    const payload = {
      title,
      message,
      url: url || '/',
      icon: icon || '/favicon.svg'
    };

    const io = req.io || req.app.get('io');
    const result = await broadcastPushNotification(payload, io);

    res.status(200).json({
      success: true,
      message: 'تم إرسال التنبيه الفوري لجميع المتابعين بنجاح!',
      result
    });
  } catch (error) {
    console.error('Send Notification Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال التنبيه' });
  }
};

/**
 * @desc    Trigger/test daily verse broadcast immediately
 * @route   POST /api/notifications/broadcast-daily-verse
 * @access  Public or Admin
 */
exports.broadcastDailyVerse = async (req, res) => {
  try {
    const io = req.io || req.app.get('io');
    const force = req.query.force === 'true' || req.body.force === true;
    const result = await checkAndSendDailyVerseNotification(io, force);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error('Broadcast Daily Verse Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
