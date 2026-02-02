import clientPromise from '../lib/mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const data = await db.collection('quiz_results')
      .find({})
      .sort({ score: -1 })
      .limit(10)
      .toArray();

    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: 'Gagal ambil leaderboard' });
  }
}
