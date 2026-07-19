const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const createDirIfNotExist = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let type = 'general';
    if (req.baseUrl.includes('sermons')) {
      type = 'sermons';
    } else if (req.baseUrl.includes('news')) {
      type = 'news';
    } else if (req.baseUrl.includes('gallery')) {
      type = 'gallery';
    } else if (req.baseUrl.includes('settings')) {
      type = 'settings';
    } else if (req.baseUrl.includes('articles')) {
      type = 'articles';
    } else if (req.baseUrl.includes('hymns')) {
      type = 'hymns';
    }
    
    const uploadPath = path.join(__dirname, '..', 'uploads', type);
    createDirIfNotExist(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (Check file types)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|mp3|wav|m4a|mp4|mkv|pdf/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم! يسمح فقط بالصور والملفات الصوتية والفيديو و PDF.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max size
  },
});

module.exports = upload;
