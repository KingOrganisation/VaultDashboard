import { getGuildSettings } from "../../../lib/db";

export default async function handler(req, res) {
  const guildId = req.query.guildId;

  try {
    const data = await getGuildSettings(guildId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}