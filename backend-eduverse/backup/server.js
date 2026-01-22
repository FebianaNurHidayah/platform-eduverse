const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');

// Model
const Course = require('./models/Course');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Koneksi database
connectDB();

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// =====================
// Route utama (testing)
// =====================
app.get('/', (req, res) => {
  res.json({
    message: 'EduVerse Backend API is running!',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      contact: '/api/contact'
    }
  });
});

// =====================
// COURSES ROUTES
// =====================

// Get semua kursus (dari database)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get kursus berdasarkan ID
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Kursus tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'ID tidak valid',
      error: error.message
    });
  }
});

// =====================
// CONTACT ROUTE
// =====================
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      message
    });

    res.json({
      success: true,
      message: 'Pesan Anda telah diterima! Tim kami akan segera merespon.',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Gagal mengirim pesan',
      error: error.message
    });
  }
});

// =====================
// Jalankan Server
// =====================
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📚 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Endpoint tersedia:`);
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/api/courses`);
});
