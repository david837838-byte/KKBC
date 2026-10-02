const mongoose = require('mongoose');

const notificationSubscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: { type: String },
    auth: { type: String }
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const NotificationSubscriptionModel = mongoose.model('NotificationSubscription', notificationSubscriptionSchema);
module.exports = require('../config/dbWrapper')('NotificationSubscription', NotificationSubscriptionModel);
