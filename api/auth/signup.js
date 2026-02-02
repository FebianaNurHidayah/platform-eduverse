import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("haloediverse");
    const users = db.collection("users");

    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const exists = await users.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    await users.insertOne({
      full_name,
      email,
      phone: phone || "",
      password,
      created_at: new Date()
    });

    return res.status(201).json({ message: "Signup berhasil" });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
}
