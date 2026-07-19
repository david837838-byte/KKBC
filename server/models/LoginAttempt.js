const mongoose = require('mongoose');

const loginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true
  },
  userAgent: {
    type: String,
    default: ''
  },
  attempts: {
    type: Number,
    default: 0
  },
  lockoutUntil: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const LoginAttemptModel = mongoose.model('LoginAttempt', loginAttemptSchema);
module.exports = require('../config/dbWrapper')('LoginAttempt', LoginAttemptModel);
