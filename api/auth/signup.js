import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { full_name, identifier, password } = req.body;

    // Validasi server-side
    if (!full_name || !identifier || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db();

    // Cek user sudah ada atau belum
    const existingUser = await db.collection('users').findOne({ identifier });
    if (existingUser) {
      return res.status(409).json({ message: 'Akun sudah terdaftar' });
    }

    // Simpan user baru
    await db.collection('users').insertOne({
      full_name,
      identifier,
      password, // nanti kita hash
      role: 'siswa',
      created_at: new Date()
    });

    return res.status(201).json({ message: 'Signup berhasil' });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}
