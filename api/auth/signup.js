import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, password } = req.body;

    if (!name || (!email && !phone) || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db('haloeduverse');

    const existingUser = await db.collection('users').findOne({
      $or: [
        email ? { email } : null,
        phone ? { phone } : null
      ].filter(Boolean)
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User sudah terdaftar' });
    }

    await db.collection('users').insertOne({
      name,
      email: email || '',
      phone: phone || '',
      password, // plain dulu
      total_stars: 0,
      created_at: new Date()
    });

    return res.status(201).json({ message: 'Signup berhasil' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
