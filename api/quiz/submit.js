import clientPromise from '../../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, fullName, classLevel, quiz, score } = req.body;

    if (!userId || !quiz || score == null) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const client = await clientPromise;
    const db = client.db();

    await db.collection('quiz_results').insertOne({
      user_id: userId,
      full_name: fullName,
      class: classLevel,
      quiz,
      score,
      created_at: new Date()
    });

    res.status(200).json({ message: 'Skor tersimpan' });

  } catch (error) {
    res.status(500).json({ message: 'Gagal simpan skor' });
  }
}
