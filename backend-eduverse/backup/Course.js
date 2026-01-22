const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul kursus harus diisi'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Deskripsi harus diisi']
  },
  category: {
    type: String,
    required: true,
    enum: ['matematika', 'sains', 'sejarah', 'teknologi', 'bahasa', 'seni']
  },
  type: {
    type: String,
    enum: ['video', 'quiz', 'interactive', 'article'],
    default: 'video'
  },
  duration: String,
  level: {
    type: String,
    enum: ['pemula', 'menengah', 'mahir'],
    default: 'pemula'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);