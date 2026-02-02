import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body;

    // Validasi input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db('haloeduverse');

    // Cari user berdasarkan identifier
    const user = await db.collection('users').findOne({
      identifier: identifier
    });

    // Jika user tidak ditemukan
    if (!user) {
      return res.status(401).json({ 
        message: 'User tidak ditemukan atau password salah' 
      });
    }

    // Verifikasi password (dengan bcrypt compare untuk password yang di-hash)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'User tidak ditemukan atau password salah' 
      });
    }

    // Hapus password dari response untuk keamanan
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'Login berhasil',
      user: {
        id: user._id,
        name: user.full_name,
        identifier: user.identifier,
        role: user.role || 'siswa',
        stars: user.total_stars || 0,
        created_at: user.created_at
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}
