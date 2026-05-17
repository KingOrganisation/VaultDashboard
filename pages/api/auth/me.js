export default function handler(req, res) {
  const user = req.cookies.vault_user;

  if (!user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  res.json(JSON.parse(user));
}