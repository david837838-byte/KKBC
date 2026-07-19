const mongoose = require('mongoose');

global.useMockDb = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/church_qanafar', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log(`Could not connect to MongoDB: ${error.message}`);
    console.log(`[Offline Fallback Mode] Swapping to local JSON database storage (server/uploads/local_db.json)`);
    global.useMockDb = true;
  }
};

module.exports = connectDB;
