const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Settings = require('../models/Settings');
const LiveStream = require('../models/LiveStream');
const Meeting = require('../models/Meeting');
const Sermon = require('../models/Sermon');
const News = require('../models/News');
const Hymn = require('../models/Hymn');
const DailyVerse = require('../models/DailyVerse');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/church_qanafar', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('Connected to database for seeding...');
    global.useMockDb = false;
  } catch (error) {
    console.log(`Could not connect to MongoDB: ${error.message}`);
    console.log('[Offline Seeding Fallback Mode] Swapping to local JSON database storage...');
    global.useMockDb = true;
  }

  try {
    // Clear existing data
    await User.deleteMany();
    await Settings.deleteMany();
    await LiveStream.deleteMany();
    await Meeting.deleteMany();
    await Sermon.deleteMany();
    await News.deleteMany();
    await Hymn.deleteMany();
    await DailyVerse.deleteMany();
    
    console.log('Cleared existing collections.');

    // 1. Create Default Admin User
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@churchqanafar.org',
      password: 'admin123', // Pre-save hook will hash this (min length is 6)
      role: 'admin',
    });
    console.log('Admin user created: admin / admin123');

    // 2. Create Initial settings
    const initialSettings = await Settings.create({
      churchName: 'الكنيسة المعمدانية الإنجيلية – خربة قنافار',
      welcomeMessage: 'مرحباً بكم في الموقع الرسمي للكنيسة المعمدانية الإنجيلية في خربة قنافار. ندعوكم لمشاركتنا في اجتماعاتنا الأسبوعية وفي دراسة كلمة الرب ومعرفة محبته ورسالته المخلصة للجميع.',
      vision: 'رؤيتنا هي أن نكون منارة حية لمحبّة المسيح في منطقة البقاع الغربي، نكرز بإنجيل الخلاص، ونبني كنيسة تنمو روحياً وتتلمذ النفوس لتمجيد اسم الرب.',
      mission: 'رسالتنا هي تمجيد الله من خلال عبادة مقدسة بالروح والحق، الكرازة الفعّالة بروح الإنجيل، تعليم كلمة الله للنمو والنضوج الروحي، وخدمة احتياجات المجتمع المحلي بمحبة المسيح.',
      beliefs: 'نحن نؤمن بالكتاب المقدس بعهديه القديم والجديد ككلمة الله الكاملة والموحى بها، وبأن الله واحد معلَن في ثلاثة أقانيم: الآب والابن والروح القدس. ونؤمن بلاهوت الرب يسوع المسيح، بموته البديل الفدائي على الصليب وقيامته المجيدة، بالخلاص المجاني بالنعمة من خلال التوبة والإيمان الشخصي بالرب يسوع، وبالمعمودية بالماء للمؤمنين بالتغطيس كعلامة للاتحاد مع المسيح، وبعمل الروح القدس في تجديد المؤمن وتقديسه وتمكينه للخدمة الحقيقية.',
      history: 'تأسست الكنيسة المعمدانية الإنجيلية في خربة قنافار لتشهد لنور المسيح في هذا الجزء الغالي من سهل البقاع اللبناني. ومنذ انطلاقتها، كانت ولا تزال بيتاً للشركة المسيحية الروحية الدافئة، ومكاناً للتعليم الكتابي السليم ورعاية النفوس وعقد الاجتماعات والمخيمات والخدمات الروحية المتنوعة، مقدمة رسالة النعمة والأمل لجميع المحيطين بها.',
      pastorsInfo: 'يخدم الكنيسة بنعمة الله القس الراعي بمشاركة فريق من الخدام والأخوة والأخوات المكرسين لرعاية النفوس، تنظيم مدارس الأحد، قيادة فترات العبادة والترنيم، والنهوض بمختلف المسؤوليات لضمان مسيرة روحية وإدارية مباركة وشفافة.',
      logo: '/assets/logo.png',
      verseText: '«أَمَّا أَنَا وَبَيْتِي فَنَعْبُدُ الرَّبَّ»',
      verseReference: 'يشوع 24: 15',
      contactEmail: 'info@churchqanafar.org',
      contactPhones: ['+961 70 123 456', '+961 08 640 123'],
      address: 'خربة قنافار، البقاع الغربي، لبنان',
      facebookUrl: 'https://facebook.com/church.qanafar',
      youtubeUrl: 'https://youtube.com/@church.qanafar',
      whatsappUrl: 'https://wa.me/96170123456',
      instagramUrl: 'https://instagram.com/church.qanafar',
      tiktokUrl: 'https://tiktok.com/@church.qanafar',
    });
    console.log('Website settings seeded.');

    // 3. Create Default Live Stream Settings
    await LiveStream.create({
      isLive: false,
      platform: 'youtube',
      url: 'https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID',
      title: 'البث المباشر للاجتماع الأسبوعي للكنيسة المعمدانية الإنجيلية - خربة قنافار',
      description: 'انضموا إلينا مباشرة للمشاركة في العبادة والترنيم والاستماع للرسالة الكتابية.',
    });
    console.log('Default LiveStream settings seeded.');

    // 4. Create Initial Weekly Meetings
    await Meeting.create([
      {
        title: 'اجتماع العبادة الرئيسي (يوم الأحد)',
        day: 'الأحد',
        time: '10:00 صباحاً',
        description: 'اجتماعنا الرئيسي للشركة، الصلاة والترنيم، وسماع الكلمة المقدسة وتفسيرها.',
        location: 'قاعة الكنيسة الرئيسية',
        order: 1,
      },
      {
        title: 'اجتماع الصلاة ودراسة الكتاب المقدس',
        day: 'الأربعاء',
        time: '6:00 مساءً',
        description: 'اجتماع منتصف الأسبوع حيث نرفع صلواتنا معاً ونتعمق في دراسة الفصول والأسفار الكتابية بشكل تفاعلي.',
        location: 'قاعة الاجتماعات الفرعية',
        order: 2,
      },
      {
        title: 'اجتماع الشباب والفرسان الروحي',
        day: 'الجمعة',
        time: '7:00 مساءً',
        description: 'وقت خاص للشباب والشابات لمناقشة التحديات اليومية من منظور إيماني كتابي، مع وقت تسبيح وشركة أخوية.',
        location: 'صالة النشاطات للشباب',
        order: 3,
      },
    ]);
    console.log('Weekly meetings seeded.');

    // 5. Create Initial Sermons
    await Sermon.create([
      {
        title: 'قوة الإيمان في الأوقات الصعبة',
        preacher: 'القس الراعي',
        date: new Date(2026, 6, 5),
        type: 'video',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Dummy
        category: 'النمو الروحي',
        description: 'رسالة تعزية وتشجيع من كلمة الله تتناول سبل الحفاظ على إيمان ثابت وقوي في وسط العواصف والتحديات الحياتية.',
      },
      {
        title: 'دراسة في عقيدة الخلاص بالنعمة',
        preacher: 'أحد خدام الكنيسة',
        date: new Date(2026, 5, 28),
        type: 'audio',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Dummy audio
        category: 'التعليم اللاهوتي',
        description: 'مفهوم الخلاص المجاني في العهد الجديد وكيفية الموازنة بين النعمة الغنية والمسؤولية الشخصية للمؤمن.',
      },
    ]);
    console.log('Initial sermons seeded.');

    // 6. Create Initial News
    await News.create([
      {
        title: 'انطلاق المخيم الصيفي السنوي للأطفال 2026',
        content: 'يسر كنيستنا الإعلان عن بدء التسجيل للمخيم الصيفي السنوي للأطفال تحت عنوان "أبطال الإيمان". يتضمن المخيم ألعاباً ترفيهية، دراسة قصص كتابية، ترانيم حركية، وأنشطة يدوية متنوعة من عمر 6 إلى 12 سنة. يبدأ المخيم في 1 أغسطس ويستمر لمدة أسبوع.',
        category: 'event',
        imageUrl: '',
        date: new Date(),
      },
      {
        title: 'إعلان بخصوص بدء سلسلة دراسات جديدة في رسالة رومية',
        content: 'نلفت انتباه جميع الإخوة والأخوات إلى أننا سنبدأ في اجتماع يوم الأربعاء القادم سلسلة دراسة وتأمل جديدة ومفصلة في رسالة الرسول بولس إلى أهل رومية. نشجع الجميع على الحضور والمشاركة الفعالة في هذه الدراسات العميقة.',
        category: 'announcement',
        imageUrl: '',
        date: new Date(),
      },
    ]);
    console.log('Initial news and announcements seeded.');

    // 7. Create Initial Hymn
    await Hymn.create({
      title: 'يا مالك قلبي وحياتي',
      lyrics: 'يا مالك قلبي وحياتي، يا سيدي ومخلصي البار\nأرفع إليك صلواتي، وأشهد بفضلك ليل نهار\n\nالقرار:\nأنت ربي، أنت حصني وصخرتي\nفي ظل جناحيك أماني وسلامي وسلوتي\n\nفي وسط التجارب والضيق، أراك بقربي تسير\nتمهد لي كل طريق، وتهديني بنورك المنير\n\nأكرس نفسي لخدمتك، وأحيا لمجد اسمك العظيم\nفأخبر الجميع بمحبتك، وأشهد لعهدهم الكريم',
      audioUrl: '',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      category: 'تسبيح وعبادة',
    });
    console.log('Initial hymn seeded.');
    
    // 8. Create Initial Daily Verses
    await DailyVerse.create([
      {
        text: '«تَعَالَوْا إِلَيَّ يَا جَمِيعَ الْمُتْعَبِينَ وَالثَّقِيلِي الْأَحْمَالِ، وَأَنَا أُرِيحُكُمْ.»',
        reference: 'متى 11: 28'
      },
      {
        text: '«لَا تَخَفْ لِأَنِّي مَعَكَ. لَا تَتَلَفَّتْ لِأَنِّي إِلَهُكَ. قَدْ أَيَّدْتُكَ وَأَعَنْتُكَ وَعَضَدْتُكَ بِيَمِينِ بِرِّي.»',
        reference: 'إشعياء 41: 10'
      },
      {
        text: '«الرَّبُّ رَاعِيَّ فَلَا يُعْوِزُنِي شَيْءٌ.»',
        reference: 'مزمور 23: 1'
      },
      {
        text: '«لِأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ، لِكَيْ لَا يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ، بَلْ تَكُونُ لَهُ الْحَيَاةُ الْأَبَدِيَّةُ.»',
        reference: 'يوحنا 3: 16'
      },
      {
        text: '«فَلَا تَهْتَمُّوا لِلْغَدِ، لِأَنَّ الْغَدَ يَهْتَمُّ بِمَا لِنَفْسِهِ. يَكْفِي الْيَوْمَ شَرُّهُ.»',
        reference: 'متى 6: 34'
      }
    ]);
    console.log('Initial daily verses seeded.');

    console.log('Seeding completed successfully!');
    if (global.useMockDb === false) {
      mongoose.connection.close();
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (global.useMockDb === false) {
      mongoose.connection.close();
    }
  }
};

seedData();
