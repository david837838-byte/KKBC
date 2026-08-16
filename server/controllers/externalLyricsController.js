const axios = require('axios');

// Curated library of famous Arabic Christian Hymns for instant offline/fast lookup
const commonHymnsLibrary = [
  {
    id: 'ext_musbee',
    title: 'أنا مسبي فيك (دايب في حب اللي فداني)',
    category: 'تسبيح وعبادة',
    lyrics: `القرار:
يسوع ليك أنت وحدك العبادة يسوع ليك أنت وحدك القيادة
ليك يسوع أنت وحدك السيادة والكل منك الكل بيك الكل ليك

1. أنا مسبي فيك دايب في حب اللي فداني
أنا شوقي ليك أنا قلبي ملك اللي اشتراني
خبيني فيك ده مكاني فيك هو أماني
وراحتي فيك يا اللي أنت جيت تموت عشاني
ترنيمي ليك كل عبادتي والأغاني

2. أنا مش هعيش بعيد تاني عن حضن أبويا
غيرك ماليش ملجأ وحصن فيه الحماية
مافرقتنيش وقت احتياجي يا رجايا وفادي حياتي
كنت وحدك الحماية غسلت قلبي وغفرت لي كل الخطايا

3. أنت الشفاء والحب أنت وفيك خلاصي
وأنت الحياة مت مكاني وشربت كاسي
أنت النجاة خدت عقابي وقصاصي
ليك السجود عليت مقامي ورفعت راسي
أنا ليك بعود أنت أبويا وأساسي`
  },
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
  },
  {
    id: 'ext_9',
    title: 'ها آتي بطيبي ودهني الحبيب',
    category: 'سجود وانسكاب',
    lyrics: `القرار:
ها آتي بطيبي ودهني الحبيب
أسكبه عند قدمي الحبيب
وأمسح رجليك بشعر الرأس
يا من فديتني من قعر الياس

1. عند الصليب أسجد بقلب كسير
شاكراً حبك وفدائك القدير
يا من حملت آثامي وعاري
ووهبتني برك ونورك المنير

2. أقدم ذاتي ذبيحة حية
مقدسة مرضية وشهية
فليس لي في السماء سواك
ومعك لا أريد شيئاً في البرية`
  }
];

// Helper to search Gemini AI with multiple model fallbacks
const fetchLyricsViaAI = async (query) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const models = ['gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-3.1-flash-lite'];

  const prompt = `أنت خبير وموثق أرشيفي لكلمات الترانيم المسيحية العربية وترانيم الكنائس الإنجيلية والمعمدانية في الشرق الأوسط (لبنان، مصر، سوريا، الأردن...).
المطلوب: جلب الكلمات الحقيقية الكاملة الدقيقة للترنيمة المسيحية التالية: "${query}".

يرجى الالتزام الصارم بالتنسيق التالي بدون علامات Markdown المعقدة مثل ### أو النجوم:
العنوان: [اسم الترنيمة الدقيق الشائع]
التصنيف: [تسبيح وعبادة / ترانيم صليب / تسليم ورجاء / فرح ونصرة...]
الكلمات:
القرار:
[نص القرار إن وجد]

1. [العدد الأول]
2. [العدد الثاني]
3. [العدد الثالث]
4. [العدد الرابع إن وجد]

اكتب الكلمات الحقيقية الأصلية كما تُرنم في الكنائس العربية. إذا لم تكن ترنيمة مسيحية معروفة نهائياً، أجب فقط: "NOT_FOUND".`;

  for (const model of models) {
    try {
      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) continue;

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!replyText || replyText.includes('NOT_FOUND')) continue;

      // Clean up any stray markdown formatting (*, #, ---)
      let cleanedText = replyText
        .replace(/\*\*/g, '')
        .replace(/###/g, '')
        .replace(/---/g, '')
        .trim();

      // Parse Title and Category
      let title = query;
      let category = 'تسبيح وعبادة';
      let lyrics = cleanedText;

      const titleMatch = cleanedText.match(/العنوان:\s*(.+)/);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }

      const catMatch = cleanedText.match(/التصنيف:\s*(.+)/);
      if (catMatch && catMatch[1]) {
        category = catMatch[1].trim();
      }

      lyrics = cleanedText
        .replace(/العنوان:\s*.+\n*/, '')
        .replace(/التصنيف:\s*.+\n*/, '')
        .replace(/الكلمات:\s*\n*/, '')
        .trim();

      return {
        title,
        category,
        lyrics,
        source: 'المكتبة السحابية الذكية 🌐'
      };
    } catch (err) {
      console.error(`Error with model ${model}:`, err.message);
    }
  }

  return null;
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
    const addedTitles = new Set();

    // 1. Search local curated library
    const matchedLocal = commonHymnsLibrary.filter(h => {
      const titleLower = h.title.toLowerCase();
      const lyricsLower = h.lyrics.toLowerCase();
      return titleLower.includes(cleanQuery) || cleanQuery.split(' ').every(word => word.length > 2 && (titleLower.includes(word) || lyricsLower.includes(word)));
    });

    matchedLocal.forEach(h => {
      results.push({ ...h, source: 'المكتبة الشاملة المعتمدة' });
      addedTitles.add(h.title);
    });

    // 2. Query Gemini AI for exact live search
    const aiResult = await fetchLyricsViaAI(q);
    if (aiResult) {
      // If AI returned a hymn not already in curated results, add it to top
      if (!addedTitles.has(aiResult.title)) {
        results.unshift({
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
