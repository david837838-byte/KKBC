const express = require('express');
const router = express.Router();
const https = require('https');

// Helper: fetch JSON from external URL using https (no extra dependencies)
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'ChurchWebsite/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

// GET /api/bible/books?translation=BSB
// Returns list of books for a given translation
router.get('/books', async (req, res) => {
  try {
    const translation = req.query.translation || 'BSB';
    const url = `https://bible.helloao.org/api/${translation}/books.json`;
    const data = await fetchJSON(url);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bible/chapter?translation=BSB&book=GEN&chapter=1
// Returns verses for a given chapter
router.get('/chapter', async (req, res) => {
  try {
    const { translation = 'BSB', book = 'GEN', chapter = '1' } = req.query;
    const url = `https://bible.helloao.org/api/${translation}/${book}/${chapter}.json`;
    const data = await fetchJSON(url);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bible/translations
// Returns the available translations list
router.get('/translations', async (req, res) => {
  try {
    const url = 'https://bible.helloao.org/api/available_translations.json';
    const data = await fetchJSON(url);
    // Filter to only RTL (Arabic, Hebrew, etc.) + major English translations
    const majorTranslations = ['BSB', 'KJV', 'WEB', 'ASV', 'YLT'];
    const arabic = data.filter(t => t.textDirection === 'rtl' && t.numberOfBooks >= 66);
    const english = data.filter(t => majorTranslations.includes(t.id));
    res.json({ success: true, data: [...arabic, ...english] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
