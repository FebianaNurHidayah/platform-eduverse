import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ identifier });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    return res.status(200).json({
      message: 'Login berhasil',
      user: {
        id: user._id,
        name: user.full_name,
        identifier: user.identifier
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
