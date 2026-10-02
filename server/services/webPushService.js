const webpush = require('web-push');
const NotificationSubscription = require('../models/NotificationSubscription');

// Ensure VAPID keys are configured
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BKiR1AMP3C1aQp9EHC2hoG86W3k8rEBv7nFbwKKQpdYC-44oEv8kW4goFQyxxBJEt7N2lZHdZTsiENhpKa558lY';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'O1FWDuQMPtBmkKDXTZ4HtdE1bNmXm2UMGhL_qYhp3UY';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:info@kherbetbaptistchurch.org';

try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('✅ WebPush VAPID configured successfully');
} catch (err) {
  console.error('❌ Error configuring WebPush VAPID:', err.message);
}

const getPublicKey = () => VAPID_PUBLIC_KEY;

/**
 * Send push notification to all subscribed devices and broadcast via Socket.io
 * @param {Object} payload { title, message, url, icon, badge, tag, data }
 * @param {Object} io Optional Socket.io instance
 */
const broadcastPushNotification = async (payload, io = null) => {
  const fullPayload = {
    title: payload.title || 'الكنيسة المعمدانية الإنجيلية',
    message: payload.message || '',
    body: payload.message || '', // standard Web Notification body field
    url: payload.url || '/',
    icon: payload.icon || '/favicon.svg',
    badge: payload.badge || '/favicon.svg',
    tag: payload.tag || `kkbc-alert-${Date.now()}`,
    timestamp: new Date().toISOString(),
    data: payload.data || { url: payload.url || '/' }
  };

  // 1. Broadcast via Socket.io to all live connected browsers/apps
  if (io) {
    try {
      io.emit('pushNotificationBroadcast', fullPayload);
      console.log(`📢 Broadcasted notification via Socket.io: "${fullPayload.title}"`);
    } catch (e) {
      console.error('Socket.io broadcast error:', e.message);
    }
  }

  // 2. Send W3C Web Push to all registered device endpoints
  let successCount = 0;
  let failureCount = 0;

  try {
    const subscriptions = await NotificationSubscription.find({});
    console.log(`📡 Sending Web Push to ${subscriptions.length} registered device(s)...`);

    const sendPromises = subscriptions.map(async (sub) => {
      // Check if it's a real browser push endpoint
      if (!sub.endpoint || !sub.endpoint.startsWith('http')) {
        return;
      }

      const pushSub = {
        endpoint: sub.endpoint,
        keys: sub.keys || {}
      };

      try {
        await webpush.sendNotification(pushSub, JSON.stringify(fullPayload));
        successCount++;
      } catch (err) {
        failureCount++;
        // If device unsubscribed, expired or endpoint invalid (404 / 410 Gone)
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log(`🗑️ Removing expired push subscription: ${sub.endpoint.substring(0, 45)}...`);
          await NotificationSubscription.deleteOne({ _id: sub._id }).catch(() => {});
        } else {
          console.warn(`⚠️ Push notification delivery warning for endpoint:`, err.message || err.statusCode);
        }
      }
    });

    await Promise.all(sendPromises);
    console.log(`✅ Web Push finished. Delivered: ${successCount}, Cleaned/Failed: ${failureCount}`);
  } catch (error) {
    console.error('Error in broadcastPushNotification:', error);
  }

  return {
    success: true,
    delivered: successCount,
    failed: failureCount
  };
};

module.exports = {
  getPublicKey,
  broadcastPushNotification
};
