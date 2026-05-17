import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./vault.db");

export function getGuildSettings(guildId) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM guild_settings WHERE guild_id = ?",
      [guildId],
      (err, row) => {
        if (err) return reject(err);

        if (!row) {
          db.run("INSERT INTO guild_settings (guild_id) VALUES (?)", [guildId]);

          return resolve({
            guild_id: guildId,
            anti_nuke: 1,
            raid_protection: 1,
            link_filter: 1,
            audit_logs: 1,
            intelligence_alerts: 1
          });
        }

        resolve(row);
      }
    );
  });
}

export default db;