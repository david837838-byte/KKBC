const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title/purpose for the expense'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide the expense amount'],
    min: [0, 'Amount must be positive'],
  },
  category: {
    type: String,
    enum: ['maintenance', 'charity', 'utilities', 'ministries', 'other'],
    default: 'other',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ExpenseModel = mongoose.model('Expense', expenseSchema);
module.exports = require('../config/dbWrapper')('Expense', ExpenseModel);
