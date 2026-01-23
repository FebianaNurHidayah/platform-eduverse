const mongoose = require('mongoose');

// Simpan koneksi dalam cache agar tidak membuat koneksi baru setiap request
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI tidak ditemukan di env');
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = db;
    console.log('✅ MongoDB Connected');
    return db;
  } catch (error) {
    console.error('❌ MongoDB error:', error.message);
    throw error;
  }
};

module.exports = connectDB;