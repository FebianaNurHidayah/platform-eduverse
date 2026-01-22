require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/database');

// Import Models
const Course = require('./models/Course');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Koneksi Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Melayani file statis (CSS, JS, Gambar) dari folder public
app.use(express.static(path.join(__dirname, "public")));

// =====================
// 3. API ROUTES (Harus Di Atas Wildcard)
// =====================

// Test API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API Backend berjalan dengan baik" });
});

// Get semua kursus
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
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'ID tidak valid',
      error: error.message
    });
  }
});

// Post kontak baru
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Semua field harus diisi'
      });
    }
    const contact = await Contact.create({ name, email, message });
    res.json({
      success: true,
      message: 'Pesan Anda telah diterima!',
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
// 4. WILDCARD ROUTE (Harus Paling Bawah)
// =====================
// Route ini akan menangani navigasi Frontend (SPA)
app.get('/healthz', (req, res) => {
  res.status(200).json({ message: 'Server berjalan' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// 5. Jalankan Server
app.listen(PORT, () => {
  console.log(`---`);
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
  console.log(`📡 API Check: http://localhost:${PORT}/api/test`);
  console.log(`🌍 Frontend: http://localhost:${PORT}/`);
  console.log(`---`);
});