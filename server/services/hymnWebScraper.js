const axios = require('axios');
const fs = require('fs');
const path = require('path');

// In-memory hymns index cache
let hymnsIndex = [];
let isIndexing = false;
let lastIndexedTime = 0;

const CACHE_FILE = path.join(__dirname, '..', 'database', 'sttakla_hymns_index.json');

// Exact letter index pages on St-Takla covering all 28 Arabic letters
const letterIndexPages = [
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__01-Alef.html',
  'alef-1.html', 'alef-2.html', 'alef-3.html', 'alef-4.html', 'alef-5.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__02-Beh.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__03-Teh.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__04-The.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__05-Geem.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__06-Hah.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__07-Khah.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__08-Dal.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__09-Thal.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__10-Reh.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__11-Zein.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__12-Sein.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__13-Shein.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__14-Saad.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__15-Daad.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__16-Tah.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__17-Zah.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__18-Ein.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__19-Ghein.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__20-Feh.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__21-Kaf.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__22-Kaaf.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__23-Laam.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__24-Meem.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__25-Noun.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__26-Heh.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__27-Waw.html',
  'Spiritual_Coptic_Orthodox_Songs_Lyrics-&-Text__28-Yeh.html'
];

// Normalize Arabic text for smart matching
const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ى]/g, 'ي')
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove tashkeel
    .replace(/[^\w\s\u0600-\u06FF]/gi, ' ') // Remove special chars
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
};

// Load saved cache or build
const initHymnsIndex = async () => {
  if (hymnsIndex.length > 0) return hymnsIndex;

  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      hymnsIndex = JSON.parse(data);
      console.log(`[HymnWebScraper] Loaded ${hymnsIndex.length} cached hymns from index.`);
      return hymnsIndex;
    }
  } catch (err) {
    console.error('[HymnWebScraper] Error reading index cache:', err.message);
  }

  // If no cache, build index
  await buildIndex();
  return hymnsIndex;
};

// Crawl letter index pages to find all hymn links
const buildIndex = async () => {
  if (isIndexing) return;
  isIndexing = true;
  console.log('[HymnWebScraper] Building real hymn catalog from Christian archives...');

  const items = [];
  const seenCombinations = new Set();

  for (const page of letterIndexPages) {
    const url = `https://st-takla.org/Lyrics-Spiritual-Songs/${page}`;
    try {
      const res = await axios.get(url, {
        responseType: 'arraybuffer',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000
      });

      const decoder = new TextDecoder('windows-1256');
      const html = decoder.decode(res.data);

      const matches = [...html.matchAll(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
      for (const m of matches) {
        let href = m[1];
        let title = m[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

        if (title.length < 3 || href.startsWith('#') || href.includes('Spiritual_') || href.includes('alef-') || href.includes('index.html') || href.includes('Contact-us') || href.includes('FAQ-') || href.includes('books/')) {
          continue;
        }

        // Build full URL
        let fullUrl = href;
        if (!fullUrl.startsWith('http')) {
          if (fullUrl.startsWith('/')) {
            fullUrl = `https://st-takla.org${fullUrl}`;
          } else if (fullUrl.startsWith('../')) {
            fullUrl = `https://st-takla.org/${fullUrl.replace('../', '')}`;
          } else {
            fullUrl = `https://st-takla.org/Lyrics-Spiritual-Songs/${fullUrl}`;
          }
        }

        const cleanT = normalizeArabic(title);
        const comboKey = `${cleanT}_${fullUrl}`;
        if (!seenCombinations.has(comboKey)) {
          seenCombinations.add(comboKey);
          items.push({
            title,
            cleanTitle: cleanT,
            url: fullUrl
          });
        }
      }
    } catch (e) {
      // Ignore individual page timeout
    }
  }

  if (items.length > 0) {
    hymnsIndex = items;
    lastIndexedTime = Date.now();
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(items, null, 2), 'utf-8');
      console.log(`[HymnWebScraper] Successfully indexed ${items.length} authentic Arabic hymns!`);
    } catch (e) {
      console.error('[HymnWebScraper] Error saving index cache:', e.message);
    }
  }
  isIndexing = false;
};

// Fetch real hymn page and parse a SINGLE pristine clean format
const fetchLyricsFromPage = async (pageUrl, title) => {
  try {
    const res = await axios.get(pageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });

    const decoder = new TextDecoder('windows-1256');
    const html = decoder.decode(res.data);

    // Replace <br> and <p> inside <td> with spaces so table cells are single coherent verse lines!
    let text = html.replace(/<td([^>]*)>([\s\S]*?)<\/td>/gi, (match, p1, inner) => {
      return '<td' + p1 + '>' + inner.replace(/<br\s*[\/]?>|<\/?p[^>]*>/gi, ' ') + '</td>';
    });

    text = text
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<a[\s\S]*?<\/a>/gi, '')
      .replace(/<\/td>\s*<td[^>]*>/gi, '   ')
      .replace(/<hr[\/]?>/gi, '\n===SPLIT===\n')
      .replace(/<table[^>]*>/gi, '\n===SPLIT===\n')
      .replace(/<\/table>/gi, '\n===SPLIT===\n')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/tr>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/@/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');

    const rawBlocks = text.split('===SPLIT===');
    const candidates = [];

    for (const block of rawBlocks) {
      const rawLines = block.split('\n');
      const filteredLines = [];

      for (let line of rawLines) {
        line = line.trim().replace(/\s+/g, ' ');
        if (!line || line.length === 0) continue;

        if (line.includes('إخفاء') || 
            line.includes('إظهار') || 
            line.includes('الصور والجداول') || 
            line.includes('نرجو الصلاة') || 
            line.includes('خدمة الموقع') || 
            line.includes('الخدام') || 
            line.includes('بحث') || 
            line.includes('الكتاب المقدس') || 
            line.includes('الجاليري') || 
            line.includes('فهرس الترانيم') || 
            line.includes('St-Takla') || 
            line.includes('تاريخ التحديث') || 
            line.includes('جميع الحقوق') || 
            line.includes('إرسل لنا') || 
            line.includes('Toggle navigation') ||
            line.includes('الانجليزية')) {
          continue;
        }

        if (line.match(/^_{3,}/) || 
            line.startsWith('من مرنمي') || 
            line.startsWith('كلمات:') || 
            line.startsWith('* ترنيم:') || 
            line.startsWith('المصدر:') || 
            line.startsWith('ألحان:') || 
            line.startsWith('تقصير الرابط') || 
            line.toLowerCase() === 'copied' || 
            line.toLowerCase() === 'copy') {
          if (filteredLines.length > 2) break;
          continue;
        }

        if (line.includes('تنسيق مختلف') || line.includes('تنسيق آخر') || line.startsWith('تنسيق ')) {
          if (filteredLines.length > 2) break;
          continue;
        }

        if (/^[\s\|\:\،\_\-\.\*\/\\#\<\>\(\)\;\,\'\"\!\?]+$/.test(line)) continue;
        if (!/[\u0600-\u06FF]/.test(line)) continue;
        if (/[a-zA-Z]{3,}/.test(line) && !line.includes('(')) continue;

        filteredLines.push(line);
      }

      if (filteredLines.length < 2) continue;

      // Intelligent single rendition trimmer
      const blockLines = [];
      const seenNorm = new Set();
      const seenVerses = new Set();
      let firstLineNorm = '';

      for (let i = 0; i < filteredLines.length; i++) {
        const line = filteredLines[i];
        const norm = line.replace(/[^\u0600-\u06FF]/g, '');
        if (!norm || norm.length < 3) {
          blockLines.push(line);
          continue;
        }

        if (firstLineNorm && norm.startsWith(firstLineNorm) && blockLines.length >= 2) break;
        if (blockLines.length >= 2 && seenNorm.has(norm)) break;

        const vMatch = line.match(/^(\d+|[١٢٣٤٥٦٧٨٩٠]+)[\s\-\.\)]|^\((\d+|[١٢٣٤٥٦٧٨٩٠]+)\)/);
        if (vMatch) {
          const vNum = vMatch[1] || vMatch[2];
          if (seenVerses.has(vNum) && seenVerses.size >= 2) break;
          seenVerses.add(vNum);
        }

        if (!firstLineNorm && norm.length >= 6) {
          firstLineNorm = norm.substring(0, 12);
        }

        seenNorm.add(norm);
        blockLines.push(line);
      }

      // Merge short broken hemistichs / half-lines
      const mergedLines = [];
      let idx = 0;
      while (idx < blockLines.length) {
        let l = blockLines[idx].trim().replace(/\s+/g, ' ');
        if (!l) { idx++; continue; }

        if (l.length < 25 && idx + 1 < blockLines.length) {
          const nxt = blockLines[idx + 1].trim().replace(/\s+/g, ' ');
          const nxtIsMarker = nxt.match(/^(\d+|[١٢٣٤٥٦٧٨٩٠]+)[\s\-\.\)]|^\((\d+|[١٢٣٤٥٦٧٨٩٠]+)\)/) || nxt.includes('القرار') || nxt.includes('قرار');
          if (!nxtIsMarker) {
            l = l + ' ' + nxt;
            idx++;
          }
        }
        mergedLines.push(l);
        idx++;
      }

      if (mergedLines.length >= 2) {
        const formatted = mergedLines.join('\n').trim();
        const avgLen = formatted.length / mergedLines.length;
        let score = 0;

        if (seenVerses.size >= 2) score += 60;
        if (formatted.includes('القرار') || formatted.includes('قرار')) score += 40;

        if (avgLen >= 30 && avgLen <= 95) score += 100;
        else if (avgLen >= 20) score += 60;
        else if (avgLen >= 15) score += 20;
        else score -= 80;

        if (mergedLines.length >= 4 && mergedLines.length <= 25) score += 30;

        candidates.push({
          text: formatted,
          linesCount: mergedLines.length,
          avgLen,
          score
        });
      }
    }

    candidates.sort((a, b) => b.score - a.score);

    let formattedLyrics = candidates.length > 0 ? candidates[0].text : '';

    if (!formattedLyrics) {
      const lines = text.replace(/===SPLIT===/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0 && /[\u0600-\u06FF]/.test(l) && !l.includes('St-Takla') && !l.includes('بحث'));
      formattedLyrics = lines.slice(0, 20).join('\n').trim();
    }

    formattedLyrics = formattedLyrics
      .replace(/^[\s\|\:\،\_\-\.\*\/\\#\<\>\(\)\;\,\'\"\!\?]+/gm, '')
      .replace(/[\s\|\:\،\_\-\.\*\/\\#\<\>\(\)\;\,\'\"\!\?]+$/gm, '')
      .trim();

    return {
      title: title || 'ترنيمة روحية',
      lyrics: formattedLyrics,
      category: 'ترانيم وتسبيح',
      source: 'أرشيف الترانيم المسيحية المعتمد 🌐',
      pageUrl
    };
  } catch (err) {
    console.error(`[HymnWebScraper] Error fetching lyrics from ${pageUrl}:`, err.message);
    return null;
  }
};

// Search real hymns
const searchRealHymns = async (query) => {
  if (!query || !query.trim()) return [];

  await initHymnsIndex();

  const cleanQ = normalizeArabic(query.trim());
  const words = cleanQ.split(' ').filter(w => w.length > 1);

  // Score matches
  const matches = [];
  for (const item of hymnsIndex) {
    let score = 0;
    if (item.cleanTitle === cleanQ) score += 100;
    else if (item.cleanTitle.startsWith(cleanQ)) score += 60;
    else if (item.cleanTitle.includes(cleanQ)) score += 40;
    else {
      const matchedWords = words.filter(w => item.cleanTitle.includes(w));
      if (matchedWords.length === words.length) score += 30;
      else if (matchedWords.length > 0) score += matchedWords.length * 10;
    }

    if (score > 0) {
      matches.push({ ...item, score });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  const topMatches = matches.slice(0, 6);

  // Fetch lyrics for the top 3 matches in parallel
  const results = [];
  for (const match of topMatches.slice(0, 3)) {
    const hymn = await fetchLyricsFromPage(match.url, match.title);
    if (hymn && hymn.lyrics.length > 20) {
      results.push(hymn);
    }
  }

  return results;
};

module.exports = {
  initHymnsIndex,
  buildIndex,
  searchRealHymns,
  fetchLyricsFromPage
};
