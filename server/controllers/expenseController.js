const Expense = require('../models/Expense');

// Helper to check if the user has permission to manage expenses
const canUserManage = (user) => {
  return user.role === 'admin' || user.canManageExpenses === true;
};

// @desc    Get all church expenses
// @route   GET /api/expenses
// @access  Private (Admin or Expenses Manager)
exports.getExpenses = async (req, res) => {
  try {
    if (!canUserManage(req.user)) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بعرض المصاريف الكنسية.' });
    }

    const expenses = await Expense.find({}).sort({ date: -1 });
    res.status(200).json({ success: true, count: expenses.length, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new expense entry
// @route   POST /api/expenses
// @access  Private (Admin or Expenses Manager)
exports.createExpense = async (req, res) => {
  try {
    if (!canUserManage(req.user)) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بإضافة مصاريف كنسية.' });
    }

    const { title, amount, category, date, description } = req.body;
    if (!title || amount === undefined) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال عنوان ومبلغ المصروف.' });
    }

    const expense = await Expense.create({
      title,
      amount,
      category: category || 'other',
      date: date || Date.now(),
      description
    });

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an expense entry
// @route   DELETE /api/expenses/:id
// @access  Private (Admin or Expenses Manager)
exports.deleteExpense = async (req, res) => {
  try {
    if (!canUserManage(req.user)) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف مصاريف كنسية.' });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'المصروف غير موجود.' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف المصروف بنجاح.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
