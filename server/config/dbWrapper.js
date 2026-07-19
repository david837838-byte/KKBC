const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbFile = path.join(__dirname, '..', 'uploads', 'local_db.json');

// Ensure database file and uploads directory exist
const ensureDbFile = () => {
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbFile)) {
    // Generate initial seed data inside the JSON database
    const initialData = {
      User: [
        {
          _id: 'admin_id_999',
          username: 'admin',
          email: 'admin@churchqanafar.org',
          // bcrypt hash for password 'admin'
          password: bcrypt.hashSync('admin', 10),
          role: 'admin',
          createdAt: new Date().toISOString()
        }
      ],
      Settings: [
        {
          _id: 'settings_id_999',
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
          updatedAt: new Date().toISOString()
        }
      ],
      LiveStream: [
        {
          _id: 'live_id_999',
          isLive: false,
          platform: 'youtube',
          url: 'https://www.youtube.com/embed/live_stream?channel=YOUR_CHANNEL_ID',
          title: 'البث المباشر للاجتماع الأسبوعي للكنيسة المعمدانية الإنجيلية - خربة قنافار',
          description: 'انضموا إلينا مباشرة للمشاركة في العبادة والترنيم والاستماع للرسالة الكتابية.',
          updatedAt: new Date().toISOString()
        }
      ],
      Meeting: [
        {
          _id: 'm1',
          title: 'اجتماع العبادة الرئيسي (يوم الأحد)',
          day: 'الأحد',
          time: '10:00 صباحاً',
          description: 'اجتماعنا الرئيسي للشركة، الصلاة والترنيم، وسماع الكلمة المقدسة وتفسيرها.',
          location: 'قاعة الكنيسة الرئيسية',
          order: 1,
          isActive: true
        },
        {
          _id: 'm2',
          title: 'اجتماع الصلاة ودراسة الكتاب المقدس',
          day: 'الأربعاء',
          time: '6:00 مساءً',
          description: 'اجتماع منتصف الأسبوع حيث نرفع صلواتنا معاً ونتعمق في دراسة الفصول والأسفار الكتابية بشكل تفاعلي.',
          location: 'قاعة الاجتماعات الفرعية',
          order: 2,
          isActive: true
        },
        {
          _id: 'm3',
          title: 'اجتماع الشباب والفرسان الروحي',
          day: 'الجمعة',
          time: '7:00 مساءً',
          description: 'وقت خاص للشباب والشابات لمناقشة التحديات اليومية من منظور إيماني كتابي، مع وقت تسبيح وشركة أخوية.',
          location: 'صالة النشاطات للشباب',
          order: 3,
          isActive: true
        }
      ],
      Sermon: [],
      News: [],
      Hymn: [
        {
          _id: 'h1',
          title: 'يا مالك قلبي وحياتي',
          lyrics: 'يا مالك قلبي وحياتي، يا سيدي ومخلصي البار\nأرفع إليك صلواتي، وأشهد بفضلك ليل نهار\n\nالقرار:\nأنت ربي، أنت حصني وصخرتي\nفي ظل جناحيك أماني وسلامي وسلوتي\n\nفي وسط التجارب والضيق، أراك بقربي تسير\nتمهد لي كل طريق، وتهديني بنورك المنير\n\nأكرس نفسي لخدمتك، وأحيا لمجد اسمك العظيم\nفأخبر الجميع بمحبتك، وأشهد لعهدهم الكريم',
          audioUrl: '',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          category: 'تسبيح وعبادة',
          createdAt: new Date().toISOString()
        }
      ],
      Gallery: [],
      Prayer: [],
      DailyVerse: []
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf8');
  }
};

const readData = () => {
  ensureDbFile();
  try {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return {};
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local JSON db:', err);
  }
};

// Generate random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
};

// Simple query matcher for basic filters
const matchesQuery = (item, query) => {
  if (!query) return true;
  for (let key in query) {
    // Handle $or query
    if (key === '$or' && Array.isArray(query[key])) {
      const orMatches = query[key].some(subQuery => matchesQuery(item, subQuery));
      if (!orMatches) return false;
      continue;
    }
    // Handle Regex
    if (query[key] && typeof query[key] === 'object' && query[key].$regex) {
      const reg = new RegExp(query[key].$regex, query[key].$options || 'i');
      if (!reg.test(item[key] || '')) return false;
      continue;
    }
    // Handle standard exact match
    if (item[key] !== query[key]) {
      return false;
    }
  }
  return true;
};

// Mock Query Chain class
class MockQuery {
  constructor(data) {
    this.data = data;
  }

  sort(sortOption) {
    if (!sortOption || !Array.isArray(this.data)) return this;
    // Basic sorting implementation (supports standard keys or date)
    const key = Object.keys(sortOption)[0];
    const direction = sortOption[key]; // 1 or -1
    
    this.data.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      
      // Parse dates if applicable
      if (key === 'date' || key === 'createdAt') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      
      if (valA < valB) return -direction;
      if (valA > valB) return direction;
      return 0;
    });
    return this;
  }

  select(fields) {
    // Mock select (e.g. select('+password') or select('-password'))
    if (typeof fields === 'string') {
      this.selectFields = fields;
    }
    return this;
  }

  limit(num) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(0, num);
    }
    return this;
  }

  skip(num) {
    if (Array.isArray(this.data)) {
      this.data = this.data.slice(num);
    }
    return this;
  }

  exec() {
    return Promise.resolve(this.data);
  }

  // To support directly returning promise for 'await Query'
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.data).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return Promise.resolve(this.data).catch(onRejected);
  }
}

const mapDoc = (doc, collectionName) => {
  if (!doc) return null;
  if (Array.isArray(doc)) {
    return doc.map(d => mapDoc(d, collectionName));
  }
  const result = {
    ...doc,
    id: doc._id
  };
  if (collectionName === 'User' && !result.matchPassword) {
    result.matchPassword = async function (enteredPassword) {
      return bcrypt.compare(enteredPassword, this.password);
    };
  }
  return result;
};

// Factory to create a Mock Model instance
const createMockModel = (collectionName) => {
  return {
    find: function (query = {}) {
      const db = readData();
      const list = db[collectionName] || [];
      const filtered = list.filter(item => matchesQuery(item, query));
      return new MockQuery(mapDoc(filtered, collectionName));
    },

    findOne: function (query = {}) {
      const db = readData();
      const list = db[collectionName] || [];
      const found = list.find(item => matchesQuery(item, query));
      return new MockQuery(mapDoc(found, collectionName));
    },

    findById: function (id) {
      const db = readData();
      const list = db[collectionName] || [];
      const found = list.find(item => item._id === id);
      return new MockQuery(mapDoc(found, collectionName));
    },

    create: function (data) {
      const db = readData();
      if (!db[collectionName]) db[collectionName] = [];
      
      const newDoc = {
        _id: generateId(),
        ...data,
        createdAt: new Date().toISOString()
      };

      // Hash password if User model
      if (collectionName === 'User' && newDoc.password) {
        newDoc.password = bcrypt.hashSync(newDoc.password, 10);
      }

      db[collectionName].push(newDoc);
      writeData(db);
      
      return Promise.resolve(mapDoc(newDoc, collectionName));
    },

    findByIdAndUpdate: function (id, updateData, options = {}) {
      const db = readData();
      const list = db[collectionName] || [];
      const idx = list.findIndex(item => item._id === id);
      
      if (idx === -1) {
        // If not found, create if Settings or LiveStream
        if (collectionName === 'Settings' || collectionName === 'LiveStream') {
          const newDoc = { _id: id, ...updateData, updatedAt: new Date().toISOString() };
          db[collectionName] = [newDoc];
          writeData(db);
          return Promise.resolve(mapDoc(newDoc, collectionName));
        }
        return Promise.resolve(null);
      }

      list[idx] = {
        ...list[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      db[collectionName] = list;
      writeData(db);
      return Promise.resolve(mapDoc(list[idx], collectionName));
    },

    findByIdAndDelete: function (id) {
      const db = readData();
      const list = db[collectionName] || [];
      const doc = list.find(item => item._id === id);
      
      if (doc) {
        db[collectionName] = list.filter(item => item._id !== id);
        writeData(db);
      }
      return Promise.resolve(mapDoc(doc, collectionName));
    },

    deleteMany: function (query = {}) {
      const db = readData();
      db[collectionName] = [];
      writeData(db);
      return Promise.resolve({ deletedCount: 0 });
    }
  };
};

module.exports = (collectionName, realMongooseModel) => {
  return new Proxy({}, {
    get: function (target, prop) {
      // If MongoDB is connected and we are NOT in mock database fallback, use real mongoose model
      if (global.useMockDb === false) {
        const value = realMongooseModel[prop];
        return typeof value === 'function' ? value.bind(realMongooseModel) : value;
      }
      
      // Fallback: use local JSON file database mock
      const mockModel = createMockModel(collectionName);
      const value = mockModel[prop];
      return typeof value === 'function' ? value.bind(mockModel) : value;
    }
  });
};
