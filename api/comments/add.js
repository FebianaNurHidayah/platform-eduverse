import clientPromise from '../../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, name, content, quiz } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Komentar kosong' });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('comments').insertOne({
      user_id: userId,
      name,
      content,
      quiz,
      created_at: new Date()
    });

    res.status(200).json({ message: 'Komentar tersimpan' });

  } catch {
    res.status(500).json({ message: 'Gagal kirim komentar' });
  }
}
