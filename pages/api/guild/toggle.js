import db from "../../../lib/db";

const allowed = [
  "anti_nuke",
  "raid_protection",
  "link_filter",
  "audit_logs",
  "intelligence_alerts"
];

export default function handler(req, res) {
  const { guildId, module, value } = req.body;

  if (!allowed.includes(module)) {
    return res.status(400).json({ error: "Invalid module" });
  }

  db.run(
    `UPDATE guild_settings SET ${module} = ? WHERE guild_id = ?`,
    [value ? 1 : 0, guildId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        success: true,
        module,
        value
      });
    }
  );
}