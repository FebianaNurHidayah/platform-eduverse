const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(process.env.MONGODB_URI);
  return cached.conn;
};

module.exports = connectDB;
