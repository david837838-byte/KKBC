const axios = require('axios');

// Curated library of famous Arabic Christian Hymns for instant offline/fast lookup
const commonHymnsLibrary = [
  {
    id: 'ext_1',
    title: 'يسوع أنت ترنيمتي',
    category: 'تسبيح وعبادة',
    lyrics: `القرار:
يسوع أنت ترنيمتي وفرحة قلبي
يسوع أنت خلاصي ونبع سلامي

1. حينما أسير في وادي الظلال
لا أخاف شراً لأنك معي
عصاك وعكازك هما يعزيانني
تمسح بالدهن رأسي كأسي ريا

2. في وسط الضيق ترعاني بحنان
تنير طريقي في كل أوان
يداي ترفعان إليك بالصلاة
فأنت يا ربي صخرة النجاة

3. أحمدك ربي من كل الفؤاد
أخبر بكل عجائبك في كل البلاد
أفرح وأبتهج بك يا إلهي
أرنم لاسمك أيها العلي`
  },
  {
    id: 'ext_2',
    title: 'يا صاحب الحنان',
    category: 'تسبيح وتعزية',
    lyrics: `القرار:
يا صاحب الحنان يا ملجأ الأنام
إليك نلتجئ في كل الأيام

1. يا سيدي يسوع يا نبع كل جود
حضورك المجيد يفيض بالوعود
تمسح الدموع وتشفي القلوب
تغفر الخطايا وتستر العيوب

2. في قربك سلام لا ينطق به
وفي سكونك أمان يطمئن إليه
نعظم اسمك ونرفع الشكران
لك المجد والحمد على مر الزمان`
  },
  {
    id: 'ext_3',
    title: 'زي العصفور لما يطير',
    category: 'فرح وحرية',
    lyrics: `القرار:
زي العصفور لما يطير في السما عالي
أنا قلبي طاير بالفرح ويا فاديَّ الغالي

1. فك القيود وكسر النير وفداني
وبدمه الغالي طهرني ونقاني
خلاني ابن له وباسمه سماني
وفي كل خطوة في دربي هو حاميني

2. لو هاج البحر والريح كانت شديدة
أنا في حمى إلهي خطواتي سديدة
يمسك بيميني ويهديني لطريقه
ويسوع ربي هو أوفى صديق ليَّ`
  },
  {
    id: 'ext_4',
    title: 'ما أحلى السجود أمام موطئ قدميك',
    category: 'سجود وعبادة',
    lyrics: `القرار:
ما أحلى السجود أمام موطئ قدميك
ما أبهى الوقوف في محضرك يا قدوس

1. حيث نرى جلالك ونختبر بهاءك
تنسكب قلوبنا بالحب والخشوع
أنت وحدك مستحق كل المجد والكرامة
لك تسجد الشعوب وتهتف بالخلاص

2. في بيتك يا رب يحلو اللقاء
تغمرنا بالنعمة وتفيض بالسخاء
نرفع تسبيحنا بخوراً زكياً
فأنت الحي إلى أبد الآبدين`
  },
  {
    id: 'ext_5',
    title: 'علمني أنتظرك يا رب',
    category: 'صلاة وثقة',
    lyrics: `القرار:
علمني أنتظرك يا رب عـارف إنك لا تتأخر
تأتي في الوقت المعين بمجدك العظيم وتظهر

1. لا بالقدرة ولا بالقوة بل بروحك يا قدوس
تفيض بالنعمة والسلام وتملأ كل النفوس
أنت حصني ومعيني وصخرة احتمائي
فيك وضعت ثقتي وكل رجائي

2. حتى وإن طال الظلام ونفد الصبر في العيان
أعلم أنك الإله الأمين على مر الزمان
سترفعني على صخرة وتهبني انتصار
فأنت الرب الصالح العادل البار`
  },
  {
    id: 'ext_6',
    title: 'باركي يا نفسي الرب ولا تنسي حسناته',
    category: 'شكر وتسبيح',
    lyrics: `القرار:
باركي يا نفسي الرب وكل ما في باطني يبارك اسمه القدوس
باركي يا نفسي الرب ولا تنسي كل حسناته

1. الذي يغفر جميع ذنوبك
الذي يشفي كل أمراضك
الذي يفدي من الحفرة حياتك
الذي يكللك بالرحمة والرأفة

2. رحيم ورؤوف هو الرب
طويل الروح وكثير الرحمة
كما يعطف الأب على البنين
يعطف الرب على خائفيه

3. باركوا الرب يا جميع ملائكته
باركوا الرب يا جميع جنوده
باركوا الرب يا جميع أعماله
في كل مواضع سلطانه باركي يا نفسي الرب`
  },
  {
    id: 'ext_7',
    title: 'قلباً نقياً اخلق فيّ يا الله',
    category: 'توبة وتكريس',
    lyrics: `القرار:
قلباً نقياً اخلق فيّ يا الله
وروحاً مستقيماً جدد في داخلي

1. لا تطرحني من قدام وجهك
وروحك القدوس لا تنزعه مني
رد لي بهجة خلاصك
وبروح منتدبة اعضدني

2. افتح شفتيَّ يا رب
فينطق فمي بتسبيحك
ذبيحة الله هي روح منكسرة
القلب المنكسر والمنسحق يا الله لا تحتقره`
  },
  {
    id: 'ext_8',
    title: 'عظيم هو الرب وحميد جداً',
    category: 'تمجيد وتسبيح',
    lyrics: `القرار:
عظيم هو الرب وحميد جداً في مدينة إلهنا
جبل قدسه جميل الارتفاع فرح كل الأرض

1. عظيم أنت يا رب وإلى الأبد أمانتك
أعمالك عجيبة وطرقك مستقيمة
لك الملك والقدرة والعزة والسلطان
من جيل إلى جيل تسبيحك يدوم

2. نسجد لك في بهجة القداسة
نعلن مجدك بين الأمم ونخبر بخلاصك
أنت صانع العجائب والرب القدير
مبارك اسمك إلى أبد الآبدين`
  }
];

// Helper to search Gemini AI if key is available
const fetchLyricsViaAI = async (query) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `أنت خبير في الترانيم المسيحية العربية وترانيم الكنائس الإنجيلية والمعمدانية.
المطلوب: جلب كلمات الترنيمة المسيحية التالية: "${query}".

يرجى الالتزام الصارم بالتنسيق التالي بدون أي مقدمات أو شرح:
العنوان: [اسم الترنيمة الدقيق]
الكلمات:
القرار:
[كلمات القرار إن وجد]

1. [العدد الأول]
2. [العدد الثاني]
3. [العدد الثالث]

إذا كانت الترنيمة معروفة، اكتب كلماتها الحقيقية والصحيحة كما تُرنم في الكنائس العربية. إذا لم تكن ترنيمة مسيحية معروفة، أجب بكلمة: "NOT_FOUND".`;

    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return null;

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!replyText || replyText.includes('NOT_FOUND')) return null;

    // Parse Title and Lyrics
    let title = query;
    let lyrics = replyText;

    const titleMatch = replyText.match(/العنوان:\s*(.+)/);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      lyrics = replyText.replace(/العنوان:\s*.+\n*/, '').replace(/الكلمات:\s*\n*/, '').trim();
    }

    return {
      title,
      lyrics,
      category: 'ترانيم عامة',
      source: 'المكتبة السحابية الذكية'
    };
  } catch (err) {
    console.error('Error fetching lyrics via AI:', err);
    return null;
  }
};

// @desc    Search external hymns & lyrics
// @route   GET /api/external-lyrics/search
// @access  Public
exports.searchExternalLyrics = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم الترنيمة للبحث' });
    }

    const cleanQuery = q.trim().toLowerCase();
    const results = [];

    // 1. Search local curated library
    const matchedLocal = commonHymnsLibrary.filter(h => 
      h.title.toLowerCase().includes(cleanQuery) || 
      h.lyrics.toLowerCase().includes(cleanQuery)
    );

    results.push(...matchedLocal.map(h => ({ ...h, source: 'المكتبة الشاملة المعتمدة' })));

    // 2. If no exact match or user searched specifically, query AI/Web fetcher
    if (results.length === 0 || matchedLocal.length === 0) {
      const aiResult = await fetchLyricsViaAI(q);
      if (aiResult) {
        results.push({
          id: `ai_${Date.now()}`,
          ...aiResult
        });
      }
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching external lyrics:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء البحث عن كلمات الترنيمة' });
  }
};

// @desc    Get popular common hymns list
// @route   GET /api/external-lyrics/common
// @access  Public
exports.getCommonHymns = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: commonHymnsLibrary.length,
      data: commonHymnsLibrary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
