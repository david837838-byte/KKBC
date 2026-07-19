const Article = require('../models/Article');
const fs = require('fs');
const path = require('path');

const deleteLocalFile = (url) => {
  if (url && url.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, '..', url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    }
  }
};

// Calculate approximate reading time (average 200 words per minute)
const calculateReadTime = (text) => {
  if (!text) return 1;
  const wordsCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordsCount / 200));
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
exports.getArticles = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'الكل') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: articles.length, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    }
    res.status(200).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Private
exports.createArticle = async (req, res) => {
  try {
    const { title, content, author, category } = req.body;
    let imageUrl = '';
    let pdfUrl = '';

    if (req.files) {
      if (req.files.articleImage && req.files.articleImage[0]) {
        imageUrl = `/uploads/articles/${req.files.articleImage[0].filename}`;
      }
      if (req.files.articlePdf && req.files.articlePdf[0]) {
        pdfUrl = `/uploads/articles/${req.files.articlePdf[0].filename}`;
      }
    }

    const readTime = calculateReadTime(content);

    const article = await Article.create({
      title,
      content,
      author: author || 'القس الراعي',
      category: category || 'مقالات روحية',
      imageUrl,
      pdfUrl,
      readTime
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    // Cleanup uploaded files on error
    if (req.files) {
      if (req.files.articleImage && req.files.articleImage[0]) {
        deleteLocalFile(`/uploads/articles/${req.files.articleImage[0].filename}`);
      }
      if (req.files.articlePdf && req.files.articlePdf[0]) {
        deleteLocalFile(`/uploads/articles/${req.files.articlePdf[0].filename}`);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
exports.updateArticle = async (req, res) => {
  try {
    let article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    }

    const updateData = { ...req.body };

    if (req.files) {
      if (req.files.articleImage && req.files.articleImage[0]) {
        deleteLocalFile(article.imageUrl);
        updateData.imageUrl = `/uploads/articles/${req.files.articleImage[0].filename}`;
      }
      if (req.files.articlePdf && req.files.articlePdf[0]) {
        deleteLocalFile(article.pdfUrl);
        updateData.pdfUrl = `/uploads/articles/${req.files.articlePdf[0].filename}`;
      }
    }

    if (updateData.content) {
      updateData.readTime = calculateReadTime(updateData.content);
    }

    article = await Article.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: article });
  } catch (error) {
    if (req.files) {
      if (req.files.articleImage && req.files.articleImage[0]) {
        deleteLocalFile(`/uploads/articles/${req.files.articleImage[0].filename}`);
      }
      if (req.files.articlePdf && req.files.articlePdf[0]) {
        deleteLocalFile(`/uploads/articles/${req.files.articlePdf[0].filename}`);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' });
    }

    deleteLocalFile(article.imageUrl);
    deleteLocalFile(article.pdfUrl);

    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف المقال بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
