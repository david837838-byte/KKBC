const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Global text settings
  churchName: {
    type: String,
    default: 'الكنيسة المعمدانية الإنجيلية – خربة قنافار',
  },
  welcomeMessage: {
    type: String,
    default: 'نرحب بكم في موقع الكنيسة المعمدانية الإنجيلية في خربة قنافار. ندعوكم لمشاركتنا في عبادة الرب ومعرفة المزيد عن محبته ورسالته المخلّصة.',
  },
  vision: {
    type: String,
    default: 'رؤيتنا هي أن نكون منارة لمحبة المسيح في منطقة البقاع الغربي، نعلن إنجيل الخلاص، ونبني مجتمع مؤمنين يعيش في النعمة والبركة والتلمذة الحقيقية.',
  },
  mission: {
    type: String,
    default: 'رسالتنا هي تمجيد الله من خلال العبادة الحقيقية، الكرازة بالإنجيل، تدريب وتلمذة المؤمنين، وخدمة المجتمع المحلي بمحبة وعمل حقيقيين.',
  },
  beliefs: {
    type: String,
    default: 'نحن نؤمن بالكتاب المقدس ككلمة الله الموحى بها والمعصومة، وبالثالوث الأقدس: الآب والابن والروح القدس، وبالخلاص بالنعمة من خلال الإيمان بيسوع المسيح، وبالمعمودية للمؤمنين بالتغطيس، وبقوة الروح القدس في حياة المؤمن للقداسة والخدمة.',
  },
  history: {
    type: String,
    default: 'تأسست الكنيسة المعمدانية الإنجيلية في خربة قنافار لخدمة كلمة الرب في منطقة البقاع اللبناني. على مر السنوات، نمت الكنيسة لتصبح مركزاً للشركة الروحية ونشر رسالة الخلاص وتقديم الدعم والتعليم لمختلف الفئات العمرية.',
  },
  pastorsInfo: {
    type: String,
    default: 'تُخدم الكنيسة بنعمة الرب بواسطة القس وفريق من الخدام والأخوة الملتزمين برعاية النفوس والتعليم الكتابي الصحيح وتنظيم شؤون الخدمة والاجتماعات الروحية.',
  },
  logo: {
    type: String, // Logo path or base64
    default: '/assets/logo.png',
  },
  // Verse of the day
  verseText: {
    type: String,
    default: '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»',
  },
  verseReference: {
    type: String,
    default: 'يشوع 24: 15',
  },
  // Contact settings
  contactEmail: {
    type: String,
    default: 'info@churchqanafar.org',
  },
  contactPhones: {
    type: [String],
    default: ['+961 70 000 000', '+961 08 000 000'],
  },
  address: {
    type: String,
    default: 'خربة قنافار، البقاع الغربي، لبنان',
  },
  addressMapUrl: {
    type: String,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13264.44473335439!2d35.733796590835974!3d33.615286591039845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ee68f237efb8d%3A0xe51a7024e036e4f3!2sKhirbet%20Qanafar!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb',
  },
  // Social links
  facebookUrl: {
    type: String,
    default: 'https://facebook.com',
  },
  youtubeUrl: {
    type: String,
    default: 'https://youtube.com',
  },
  whatsappUrl: {
    type: String,
    default: 'https://wa.me/96170000000',
  },
  instagramUrl: {
    type: String,
    default: 'https://instagram.com',
  },
  tiktokUrl: {
    type: String,
    default: 'https://tiktok.com',
  },
  // Hero section settings
  heroImageUrl: {
    type: String,
    default: '', // will be set
  },
  heroVideoUrl: {
    type: String,
    default: '',
  },
  visitorCount: {
    type: Number,
    default: 0
  },
  // Chatbot configurations
  isChatbotEnabled: {
    type: Boolean,
    default: true
  },
  chatbotName: {
    type: String,
    default: 'المساعد الروحي للكنيسة'
  },
  chatbotSystemInstructions: {
    type: String,
    default: 'أنت مساعد روحي مسيحي مخصص لموقع الكنيسة المعمدانية الإنجيلية في خربة قنافار. مهمتك الحصرية هي الإجابة عن الأسئلة المتعلقة بالكتاب المقدس المسيحي (العهد القديم والعهد الجديد) وتقديم آيات تشجيعية وتأملات مريحة للنفوس بناءً على كلمة الله فقط. لا تجب إطلاقاً عن أي أسئلة سياسية أو فكرية أو علمية أو غير دينية خارج نطاق الكتاب المقدس المسيحي وعقيدة الكنيسة. إذا سألك أحد عن هذه المواضيع الخارجة، أجب بلطف بعبارة مثل: "عذراً، أنا مبرمج للإجابة عن مواضيع الكتاب المقدس والروحيات فقط". إذا كانت الأسئلة التي يطرحها الزائر صعبة أو لاهوتية عميقة أو تتطلب إرشاداً روحياً شخصياً أو اعترافاً أو مشورة عائلية، فقم بتحويله بلطف وقدم له رقم هاتف القسيس للتواصل المباشر.'
  },
  pastorPhoneNumber: {
    type: String,
    default: '+961 70 000 000'
  },
  // Note: geminiApiKey has been moved to .env for security (GEMINI_API_KEY)
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const SettingsModel = mongoose.model('Settings', settingsSchema);
module.exports = require('../config/dbWrapper')('Settings', SettingsModel);
