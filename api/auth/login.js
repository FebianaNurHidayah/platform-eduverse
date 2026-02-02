import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("haloediverse");
    const users = db.collection("users");

    const { email, password } = req.body;

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
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
}
