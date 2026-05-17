import db from "../../../lib/db";

export default function handler(req, res) {
  const { guildId, config } = req.body;

  db.run(
    `INSERT OR REPLACE INTO guild_settings (
      guild_id,
      anti_nuke,
      raid_protection,
      link_filter,
      audit_logs,
      intelligence_alerts
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      guildId,
      config.anti_nuke ?? 1,
      config.raid_protection ?? 1,
      config.link_filter ?? 1,
      config.audit_logs ?? 1,
      config.intelligence_alerts ?? 1
    ]
  );

  res.json({ success: true });
}