const Hymn = require('../models/Hymn');
const path = require('path');
const fs = require('fs');

// Helper to delete local files
const deleteLocalFile = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join(__dirname, '..', fileUrl);
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting local file:', err);
  });
};

// Memory store for the currently active hymn presentation
let activePresentationHymn = null;

// @desc    Get all hymns
// @route   GET /api/hymns
// @access  Public
exports.getHymns = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { lyrics: { $regex: search, $options: 'i' } },
      ];
    }

    const hymns = await Hymn.find(query).sort({ title: 1 });
    res.status(200).json({ success: true, count: hymns.length, data: hymns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single hymn
// @route   GET /api/hymns/:id
// @access  Public
exports.getHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }
    res.status(200).json({ success: true, data: hymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new hymn
// @route   POST /api/hymns
// @access  Private
exports.createHymn = async (req, res) => {
  try {
    const hymnData = { ...req.body };
    
    if (req.file) {
      hymnData.imageUrl = `/uploads/hymns/${req.file.filename}`;
    }

    const hymn = await Hymn.create(hymnData);
    res.status(201).json({ success: true, data: hymn });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update hymn
// @route   PUT /api/hymns/:id
// @access  Private
exports.updateHymn = async (req, res) => {
  try {
    let hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }

    const updateData = { ...req.body };
    
    if (req.file) {
      // Delete old file if existed
      if (hymn.imageUrl) {
        deleteLocalFile(hymn.imageUrl);
      }
      updateData.imageUrl = `/uploads/hymns/${req.file.filename}`;
    }

    hymn = await Hymn.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // If the active presentation hymn is the one being updated, refresh it
    if (activePresentationHymn && activePresentationHymn._id === req.params.id) {
      activePresentationHymn = {
        ...activePresentationHymn,
        ...hymn.toObject()
      };
      req.io.emit('hymnPresentationUpdate', activePresentationHymn);
    }

    res.status(200).json({ success: true, data: hymn });
  } catch (error) {
    if (req.file) deleteLocalFile(`/uploads/hymns/${req.file.filename}`);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete hymn
// @route   DELETE /api/hymns/:id
// @access  Private
exports.deleteHymn = async (req, res) => {
  try {
    const hymn = await Hymn.findById(req.params.id);
    if (!hymn) {
      return res.status(404).json({ success: false, message: 'الترنيمة غير موجودة' });
    }

    // Delete uploaded image file if existed
    if (hymn.imageUrl) {
      deleteLocalFile(hymn.imageUrl);
    }

    // If the active presentation hymn is the one being deleted, clear screen
    if (activePresentationHymn && activePresentationHymn._id === req.params.id) {
      activePresentationHymn = null;
      req.io.emit('hymnPresentationUpdate', null);
    }

    await Hymn.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'تم حذف الترنيمة بنجاح' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current active hymn presentation
// @route   GET /api/hymns/present/active
// @access  Public
exports.getActivePresentationHymn = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: activePresentationHymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set current active hymn presentation
// @route   POST /api/hymns/present/active
// @access  Private
exports.setActivePresentationHymn = async (req, res) => {
  try {
    activePresentationHymn = req.body.hymn; // expect whole hymn object or null
    
    // Broadcast active presentation hymn to all connected sockets
    req.io.emit('hymnPresentationUpdate', activePresentationHymn);
    
    res.status(200).json({ success: true, data: activePresentationHymn });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to parse raw hymns text into structured JSON array
const parseRawHymnsText = (text) => {
  if (!text) return [];

  // Step 1: Separate Index/Table of Contents if present at the end
  const indexKeywords = [/فهرس/i, /جدول الترانيم/i, /محتويات/i, /index/i, /table of contents/i];
  let mainBody = text;

  for (const keyword of indexKeywords) {
    const match = text.match(keyword);
    if (match && match.index > text.length * 0.5) {
      mainBody = text.substring(0, match.index);
      break;
    }
  }

  // Step 2: Split text into lines and parse numbered/titled hymns
  const lines = mainBody.split(/\r?\n/);
  const hymns = [];
  let currentHymn = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Header Regex: "ترنيمة 1", "ترنيمة (1)", "1.", "1-", "1 -", "#1"
    const headerMatch = trimmed.match(/^(?:ترنيمة\s*\(?(\d+)\)?[:\s-]*|(\d+)[\.\-]\s*|#(\d+)\s*)(.*)$/i);

    if (headerMatch) {
      const hymnNum = headerMatch[1] || headerMatch[2] || headerMatch[3];
      const inlineTitle = headerMatch[4] ? headerMatch[4].trim() : '';

      if (currentHymn && (currentHymn.title || currentHymn.lyrics)) {
        hymns.push(currentHymn);
      }

      currentHymn = {
        number: hymnNum ? parseInt(hymnNum) : hymns.length + 1,
        title: inlineTitle,
        lyrics: '',
        category: 'عامة'
      };
    } else {
      if (!currentHymn) {
        currentHymn = {
          number: 1,
          title: trimmed,
          lyrics: '',
          category: 'عامة'
        };
      } else if (!currentHymn.title) {
        currentHymn.title = trimmed;
      } else {
        currentHymn.lyrics += (currentHymn.lyrics ? '\n' : '') + trimmed;
      }
    }
  }

  if (currentHymn && (currentHymn.title || currentHymn.lyrics)) {
    hymns.push(currentHymn);
  }

  // Fallback if no explicit headers found: split by double blank lines
  if (hymns.length <= 1) {
    const blocks = mainBody.split(/\n\s*\n+/);
    if (blocks.length > 1) {
      hymns.length = 0;
      blocks.forEach((block, idx) => {
        const blockLines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (blockLines.length > 0) {
          hymns.push({
            number: idx + 1,
            title: blockLines[0].replace(/^[\d\.\-\s]+/, ''),
            lyrics: blockLines.slice(1).join('\n'),
            category: 'عامة'
          });
        }
      });
    }
  }

  return hymns.map(h => ({
    title: (h.title || `ترنيمة ${h.number}`).substring(0, 150),
    lyrics: (h.lyrics || '').trim(),
    category: h.category || 'عامة'
  })).filter(h => h.title.length > 0);
};

// @desc    Parse uploaded Hymns document (PDF, TXT, JSON) or pasted text
// @route   POST /api/hymns/parse-file
// @access  Private
exports.parseHymnsFile = async (req, res) => {
  try {
    let extractedText = '';

    if (req.body && req.body.rawText) {
      extractedText = req.body.rawText;
    } else if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        try {
          const pdfParse = require('pdf-parse');
          const dataBuffer = fs.readFileSync(req.file.path);
          if (typeof pdfParse === 'function') {
            const pdfData = await pdfParse(dataBuffer);
            extractedText = pdfData.text || '';
          } else {
            extractedText = dataBuffer.toString('utf8');
          }
        } catch (e) {
          console.error('PDF parsing error, falling back:', e);
          extractedText = '';
        }
      } else if (ext === '.json') {
        const fileData = fs.readFileSync(req.file.path, 'utf8');
        try {
          const parsedJson = JSON.parse(fileData);
          if (Array.isArray(parsedJson)) {
            if (req.file.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            return res.status(200).json({ success: true, count: parsedJson.length, hymns: parsedJson });
          }
        } catch (e) {}
        extractedText = fileData;
      } else {
        extractedText = fs.readFileSync(req.file.path, 'utf8');
      }

      if (req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } else {
      return res.status(400).json({ success: false, message: 'يرجى تقديم ملف أو نص الترانيم' });
    }

    const hymnsList = parseRawHymnsText(extractedText);
    res.status(200).json({ 
      success: true, 
      count: hymnsList.length, 
      hymns: hymnsList,
      rawPreviewLength: extractedText.length 
    });
  } catch (error) {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bulk Import array of hymns into MongoDB
// @route   POST /api/hymns/bulk-import
// @access  Private
exports.bulkImportHymns = async (req, res) => {
  try {
    const { hymns, overwrite } = req.body;
    if (!Array.isArray(hymns) || hymns.length === 0) {
      return res.status(400).json({ success: false, message: 'قائمة الترانيم فارغة' });
    }

    if (overwrite) {
      await Hymn.deleteMany({});
    }

    const formattedHymns = hymns.map(h => ({
      title: h.title ? h.title.trim() : 'ترنيمة بدون عنوان',
      lyrics: h.lyrics ? h.lyrics.trim() : '',
      category: h.category || 'عامة',
      audioUrl: h.audioUrl || '',
      videoUrl: h.videoUrl || '',
      imageUrl: h.imageUrl || ''
    })).filter(h => h.title.length > 0);

    const inserted = await Hymn.insertMany(formattedHymns);

    res.status(201).json({
      success: true,
      message: `تم استيراد ${inserted.length} ترنيمة بنجاح!`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Import scanned hymn images & match with Index titles
// @route   POST /api/hymns/import-scanned
// @access  Private
exports.importScannedHymns = async (req, res) => {
  try {
    const { indexText, category, overwrite } = req.body;
    
    // Parse indexText into list of titles
    let titles = [];
    if (indexText && typeof indexText === 'string') {
      titles = indexText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => line.replace(/^(?:ترنيمة\s*\d*[:\s-]*|\d+[\.\-]\s*|#\d+\s*)/i, '').trim())
        .filter(t => t.length > 0);
    }

    const files = req.files || [];
    if (files.length === 0 && titles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'يرجى رفع صور الترانيم أو إدخال الفهرس' 
      });
    }

    if (overwrite === 'true' || overwrite === true) {
      await Hymn.deleteMany({});
    }

    const hymnsToInsert = [];
    const count = Math.max(files.length, titles.length);

    for (let i = 0; i < count; i++) {
      const file = files[i];
      const titleFromIndex = titles[i];
      
      const hymnTitle = titleFromIndex || (file ? `ترنيمة ${i + 1}` : `ترنيمة ${i + 1}`);
      const imageUrl = file ? `/uploads/hymns/${file.filename}` : '';

      hymnsToInsert.push({
        title: hymnTitle.substring(0, 150),
        lyrics: `ترنيمة رقم ${i + 1} - ${hymnTitle}`,
        category: category || 'كتاب الترانيم المصور',
        imageUrl: imageUrl,
        audioUrl: '',
        videoUrl: ''
      });
    }

    const inserted = await Hymn.insertMany(hymnsToInsert);

    res.status(201).json({
      success: true,
      message: `تم ربط واستيراد ${inserted.length} ترنيمة مصورة بنجاح!`,
      count: inserted.length,
      data: inserted
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach(f => deleteLocalFile(`/uploads/hymns/${f.filename}`));
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
