require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('../config/database');

// Models
const Course = require('../models/Course');
const Contact = require('../models/Contact');

const app = express();

/* =====================
   BASIC MIDDLEWARE
===================== */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   HEALTH CHECK (NO DB)
===================== */
app.get('/healthz', (req, res) => {
  res.status(200).json({ message: 'Server berjalan' });
});

/* =====================
   DATABASE (SERVERLESS SAFE)
===================== */
let isDBConnected = false;

app.use(async (req, res, next) => {
  if (isDBConnected) return next();

  try {
    await connectDB();
    isDBConnected = true;
    next();
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Database connection failed'
    });
  }
});

/* =====================
   API ROUTES
===================== */
app.get('/api/test', (req, res) => {
  res.json({ message: 'API Backend berjalan dengan baik' });
});

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
      error: error.message
    });
  }
});

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
      error: 'ID tidak valid'
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi'
      });
    }

    const contact = await Contact.create({ name, email, message });
    res.json({
      success: true,
      message: 'Pesan diterima',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/* =====================
   FRONTEND (STATIC + SPA)
===================== */
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

/* =====================
   EXPORT (WAJIB)
===================== */
module.exports = app;
