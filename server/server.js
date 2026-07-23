const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter, authLimiter, chatbotLimiter } = require('./middleware/rateLimiters');
const sanitizeInputs = require('./middleware/sanitizer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

// Connect to MongoDB
connectDB();

const app = express();
app.disable('x-powered-by'); // SECURITY: Conceal server framework identification
const server = http.createServer(app);

// ===== SECURITY: CORS Origins configuration =====
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

if (process.env.CORS_ORIGINS) {
  allowedOrigins.push(...process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()));
}

console.log('✅ Base allowed CORS origins:', allowedOrigins);

// Configure Socket.io with dynamic CORS
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || process.env.NODE_ENV === 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('غير مسموح بالوصول من هذا المصدر (CORS)'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
});

// Attach socket.io instance to request so controllers can use it
app.set('io', io);
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ===== SECURITY: Helmet - HTTP Security Headers & Advanced CSP =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow serving uploaded files
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }, // Allows YouTube embeds to receive Referer header
  xFrameOptions: { action: 'sameorigin' },
  xContentTypeOptions: true,
  xXssFilter: true,
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
      mediaSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
      connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:', 'https://generativelanguage.googleapis.com'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"]
    }
  }
}));

// ===== SECURITY: CORS - Restricted Origins =====
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
      process.env.NODE_ENV === 'production' ||
      origin.startsWith('http://127.0.0.1') ||
      origin.startsWith('http://localhost');

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(new Error('غير مسموح بالوصول من هذا المصدر (CORS)'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== SECURITY: NoSQL Injection & XSS Input Sanitization =====
app.use(sanitizeInputs);

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes (with appropriate rate limiters)
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/sermons', apiLimiter, require('./routes/sermons'));
app.use('/api/news', apiLimiter, require('./routes/news'));
app.use('/api/meetings', apiLimiter, require('./routes/meetings'));
app.use('/api/livestream', apiLimiter, require('./routes/livestream'));
app.use('/api/prayers', apiLimiter, require('./routes/prayers'));
app.use('/api/hymns', apiLimiter, require('./routes/hymns'));
app.use('/api/gallery', apiLimiter, require('./routes/gallery'));
app.use('/api/settings', apiLimiter, require('./routes/settings'));
app.use('/api/analytics', apiLimiter, require('./routes/analytics'));
app.use('/api/chatbot', chatbotLimiter, require('./routes/chatbot'));
app.use('/api/bible', apiLimiter, require('./routes/bible'));
app.use('/api/articles', apiLimiter, require('./routes/articles'));
app.use('/api/counseling', apiLimiter, require('./routes/counseling'));
app.use('/api/expenses', apiLimiter, require('./routes/expenses'));
app.use('/api/daily-verses', apiLimiter, require('./routes/dailyVerses'));
app.use('/api/backups', apiLimiter, require('./routes/backups'));
app.use('/api/notifications', apiLimiter, require('./routes/notifications'));

// Serve Frontend in Production (If build files exist in public)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Dynamic SEO / Open Graph tags fallback helper
const Article = require('./models/Article');
const Sermon = require('./models/Sermon');

const cleanDescription = (text, length = 150) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').substring(0, length) + '...';
};

// For SPA routing fallback to index.html with dynamic Meta Tags
app.get('*', async (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }

  const indexPath = path.join(publicPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(200).send('كنيسة خربة قنافار الانجيلية - الخادم نشط. الرجاء تشغيل واجهة React.');
  }

  try {
    let html = fs.readFileSync(indexPath, 'utf8');
    const domain = `${req.protocol}://${req.get('host')}`;
    let title = 'كنيسة خربة قنافار الإنجيلية';
    let description = 'الموقع الرسمي لكنيسة خربة قنافار الإنجيلية المعمدانية - مواعيد الاجتماعات، العظات، الترانيم والكتاب المقدس.';
    let imageUrl = `${domain}/favicon.svg`;

    const id = req.query.id;
    if (id) {
      if (req.path.includes('/articles')) {
        try {
          const article = await Article.findById(id);
          if (article) {
            title = article.title;
            description = cleanDescription(article.content);
            if (article.imageUrl) {
              imageUrl = article.imageUrl.startsWith('http') ? article.imageUrl : `${domain}${article.imageUrl}`;
            }
          }
        } catch (err) {
          console.error('Error fetching article for SEO tags', err);
        }
      } else if (req.path.includes('/sermons')) {
        try {
          const sermon = await Sermon.findById(id);
          if (sermon) {
            title = sermon.title;
            description = `عظة كنسية بقلم: ${sermon.preacher} - ${cleanDescription(sermon.description || '')}`;
          }
        } catch (err) {
          console.error('Error fetching sermon for SEO tags', err);
        }
      }
    }

    const ogTags = `
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:url" content="${domain}${req.originalUrl}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${imageUrl}" />
    `;

    // Remove default title and inject ogTags inside <head>
    html = html.replace(/<title>.*?<\/title>/gi, '');
    html = html.replace('</head>', `${ogTags}\n</head>`);
    res.send(html);
  } catch (err) {
    console.error('SEO injection error', err);
    res.sendFile(indexPath);
  }
});

// Socket.io connection logic
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ داخلي في الخادم',
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
