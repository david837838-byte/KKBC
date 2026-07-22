const NotificationSubscription = require('../models/NotificationSubscription');

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
        keys,
        userAgent: req.headers['user-agent'] || ''
      });
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
      icon: icon || '/favicon.svg',
      timestamp: new Date().toISOString()
    };

    // Broadcast via Socket.io real-time web sockets
    const io = req.io || req.app.get('io');
    if (io) {
      console.log('📢 Broadcasting notification to all connected clients:', payload.title);
      io.emit('pushNotificationBroadcast', payload);
    } else {
      console.warn('⚠️ Socket.io instance not found on request');
    }

    // Try optional web-push broadcast if web-push package is present
    try {
      const webpush = require('web-push');
      const subscribers = await NotificationSubscription.find({});
      subscribers.forEach(sub => {
        webpush.sendNotification(sub, JSON.stringify(payload)).catch(err => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            NotificationSubscription.deleteOne({ _id: sub._id }).catch(() => {});
          }
        });
      });
    } catch (e) {
      // web-push module optional or not configured, socket.io broadcast handled it
    }

    res.status(200).json({
      success: true,
      message: 'تم إرسال التنبيه الفوري لجميع المتابعين بنجاح!'
    });
  } catch (error) {
    console.error('Send Notification Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال التنبيه' });
  }
};
