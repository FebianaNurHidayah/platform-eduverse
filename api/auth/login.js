import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib" });
  }

  try {
    await client.connect();
    const db = client.db("haloediverse");
    const users = db.collection("users");

    const user = await users.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Login gagal" });
    }

    return res.status(200).json({
      message: "Login berhasil",
      user: {
        full_name: user.full_name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    await client.close();
  }
}
