const News = require('../models/News');
const fs = require('fs');
const path = require('path');

const deleteLocalFile = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting image: ${filePath}`, err);
      }
    }
  }
};

// @desc    Get all news/announcements
// @route   GET /api/news
// @access  Public
exports.getAllNews = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    const rawNews = await News.find(query).sort({ date: -1 });

    const news = [];
    rawNews.forEach(doc => {
      const item = doc.toObject ? doc.toObject() : doc;
      let hasNumericKeys = false;

      Object.keys(item).forEach(key => {
        if (!isNaN(key) && item[key] && typeof item[key] === 'object' && item[key].title) {
          hasNumericKeys = true;
          if (!category || item[key].category === category) {
            news.push({
              _id: `${item._id}_${key}`,
              title: item[key].title || '',
              content: item[key].content || '',
              category: item[key].category || 'news',
              imageUrl: item[key].imageUrl || '',
              date: item[key].date || item.createdAt || new Date(),
              ...item[key]
            });
          }
        }
      });

      if (!hasNumericKeys && item.title) {
        news.push(item);
      }
    });

    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single news details
// @route   GET /api/news/:id
// @access  Public
exports.getNewsDetails = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    }
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new news item
// @route   POST /api/news
// @access  Private
exports.createNews = async (req, res) => {
  try {
    const { title, content, category, date } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/news/${req.file.filename}`;
    }

    const newsDate = (date && typeof date === 'string' && date.trim() !== '') ? new Date(date) : new Date();

    const news = await News.create({
      title,
      content,
      category: category || 'news',
      imageUrl,
      date: isNaN(newsDate.getTime()) ? new Date() : newsDate,
    });

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/news/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update news item
// @route   PUT /api/news/:id
// @access  Private
exports.updateNews = async (req, res) => {
  try {
    let news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    }

    const updateData = { ...req.body };

    if (updateData.date) {
      const parsedDate = new Date(updateData.date);
      updateData.date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    }

    if (req.file) {
      deleteLocalFile(news.imageUrl);
      updateData.imageUrl = `/uploads/news/${req.file.filename}`;
    }

    news = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/news/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete news item
// @route   DELETE /api/news/:id
// @access  Private
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'الخبر غير موجود' });
    }

    deleteLocalFile(news.imageUrl);

    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الخبر بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
