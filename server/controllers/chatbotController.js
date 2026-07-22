const Settings = require('../models/Settings');

// @desc    Generate chatbot response using Gemini API
// @route   POST /api/chatbot
// @access  Public
exports.chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'الرجاء إدخال نص الرسالة' });
    }

    // Get current settings
    const settings = await Settings.findOne({});
    const isEnabled = settings ? settings.isChatbotEnabled !== false : true;
    if (!isEnabled) {
      return res.status(400).json({ success: false, message: 'المساعد الروحي معطل حالياً من قبل الإدارة.' });
    }

    // Get API Key: from environment variable ONLY (never store in database for security)
    const apiKey = process.env.GEMINI_API_KEY;
    const pastorPhone = settings.pastorPhoneNumber || '+961 70 000 000';

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        reply: `مرحباً بك! أنا مساعدك الروحي للكتاب المقدس. 
(تنبيه للمسؤول: الرجاء إضافة مفتاح Gemini API Key في إعدادات لوحة التحكم لتفعيل الإجابات الذكية).

للحصول على مشورة روحية مباشرة أو إجابة على أسئلتك العميقة، يسعدنا جداً تواصلك مع القسيس مباشرة عبر الهاتف أو واتساب على الرقم التالي:
${pastorPhone}`
      });
    }

    const chatbotName = settings.chatbotName || 'المساعد الروحي للكنيسة';

    // Core bulletproof system instructions hardcoded in the backend
    const systemInstructions = `أنت هو "${chatbotName}"، مساعد روحي مسيحي مخصص لموقع الكنيسة المعمدانية الإنجيلية في خربة قنافار.
مهمتك الحصرية والوحيدة هي الإجابة عن الأسئلة المتعلقة بالكتاب المقدس المسيحي (العهدين القديم والجديد)، العقيدة المسيحية، الإيمان، وتقديم آيات تشجيعية وتأملات روحية مبنية بالكامل على كلمة الله.

قوانين صارمة يجب عليك الالتزام بها:
1. الإجابة فقط وفقط عن الكتاب المقدس والمسيحية. لا تجب عن أي موضوع آخر خارج هذا النطاق إطلاقاً (مثل: العلوم، الرياضيات، السياسة، البرمجة، الطبخ، إلخ). إذا سُئلت عن أي شيء خارج النطاق، اعتذر بلطف وذكّر المستخدم بأنك مبرمج فقط للإجابة عن الأسئلة الكتابية والروحية.
2. عند طلب آيات تشجيعية، قم بتقديم آيات مباركة وواضحة من الكتاب المقدس مع ذكر الشاهد الكتابي (مثال: متى 5: 14).
3. عندما يطلب المستخدم قراءة أو تفسير أصحاح معين (مثل: إنجيل متى أصحاح 5)، قم بعرض الأصحاح أو تفسيره الروحي بوضوح ومحبة.
4. استخدم لغة محبة، مشجعة، ووقورة تليق بخدمة كلمة الله.
5. رقم هاتف القسيس الحالي للتواصل المباشر والمشورة الروحية العميقة هو: ${pastorPhone}.
6. إذا سألك المستخدم أسئلة لاهوتية معقدة جداً، أو طلب إرشاداً روحياً خاصاً أو اعترافاً أو مشورة عائلية/شخصية عميقة، وجّهه بلطف ومحبة للتواصل مع راعي الكنيسة (القسيس) مباشرة عبر الهاتف أو واتساب على الرقم التالي: ${pastorPhone}.
7. احرص دائماً على إكمال إجاباتك ورسائلك بالكامل وإنهاء الجمل والأفكار بطريقة سلسة ومكتملة تليق بالقارئ دون انقطاع.`;

    // Map history to Gemini contents format
    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-10).forEach(msg => { // Send last 10 messages only for token efficiency
        if (msg.text) {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        }
      });
    }

    // Append the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const payload = {
      contents,
      systemInstruction: {
        parts: [{ text: systemInstructions }]
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    };

    // Call Gemini Flash API directly using native node fetch
    let modelName = 'gemini-flash-latest';
    let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Gemini API Error for model ${modelName}:`, errorText);

      // Check if it's a transient high-demand, rate-limit, or overload error
      const isTransientError = response.status === 429 || response.status === 503 || 
                               errorText.includes('high demand') || errorText.includes('RESOURCE_EXHAUSTED') ||
                               errorText.includes('overloaded');

      if (isTransientError) {
        console.warn(`Retrying with fallback model gemini-flash-lite-latest...`);
        modelName = 'gemini-flash-lite-latest';
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Fallback Error Response:', errorText);
      
      let googleErrorMsg = '';
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.error && errJson.error.message) {
          googleErrorMsg = errJson.error.message;
        }
      } catch (e) {
        // Not a JSON error body
      }

      let reply = `عذراً، لم أتمكن من معالجة طلبك عبر الذكاء الاصطناعي في هذه اللحظة.
إذا كان لديك استفسار روحي عميق أو تحتاج لمشورة، يرجى الاتصال بالقسيس مباشرة على الرقم: ${pastorPhone}`;

      if (googleErrorMsg) {
        reply = `عذراً، واجهت خدمة الذكاء الاصطناعي الخطأ التالي أثناء محاولة معالجة طلبك:
"${googleErrorMsg}"
(تنبيه للمسؤول: يرجى التحقق من صحة مفتاح Gemini API Key وصلاحيته في لوحة التحكم).
للاستفسارات العاجلة، يمكنك التواصل مع القسيس مباشرة على الرقم: ${pastorPhone}`;
      } else if (errorText.includes('API_KEY_INVALID') || errorText.includes('key is invalid') || errorText.includes('API key not valid') || errorText.includes('API_KEY_SERVICE_BLOCKED')) {
        reply = `عذراً، مفتاح Gemini API Key الذي تم إدخاله في لوحة التحكم غير صالح أو غير صحيح أو محظور.
(تنبيه للمسؤول: يرجى إدخال مفتاح Gemini API Key صالح من Google AI Studio في لوحة التحكم وتأكيد الحفظ لتفعيل إجابات الذكاء الاصطناعي الذكية).
للاستفسارات العاجلة، يمكنك التواصل مع القسيس مباشرة على الرقم: ${pastorPhone}`;
      }

      return res.status(200).json({
        success: true,
        reply
      });
    }

    const data = await response.json();
    
    // Parse response text
    let reply = '';
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      reply = `أهلاً بك! لم أستطع استخلاص إجابة دقيقة. يمكنك دائماً الحصول على مشورة مباشرة من القسيس على الرقم: ${pastorPhone}`;
    }

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error('Chatbot Controller Error:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ غير متوقع أثناء معالجة الطلب.' });
  }
};
