import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { full_name, identifier, password, role } = req.body;

    // Validasi data
    if (!full_name || !identifier || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db('haloeduverse');

    // Cek apakah user sudah terdaftar berdasarkan identifier
    const existingUser = await db.collection('users').findOne({
      identifier: identifier
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User sudah terdaftar' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Siapkan data user
    const userData = {
      full_name,
      identifier, // Menyimpan email/phone dalam satu field
      password: hashedPassword,
      role: role || 'siswa', // Default role adalah siswa
      total_stars: 0,
      created_at: new Date()
    };

    // Simpan ke database
    const result = await db.collection('users').insertOne(userData);

    return res.status(201).json({ 
      message: 'Signup berhasil',
      user_id: result.insertedId,
      role: userData.role,
      full_name: userData.full_name
    });

  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
