import { useEffect, useState } from "react";
import { initWS, sendWS } from "../lib/ws";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [settings, setSettings] = useState(null);
  const [alerts, setAlerts] = useState([]);

  /* ---------------------------
     LOAD USER
  ----------------------------*/
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(setUser);
  }, []);

  /* ---------------------------
     INIT WS
  ----------------------------*/
  useEffect(() => {
    if (!user) return;

    initWS(user.id, (event) => {
      if (event.type === "security_alert") {
        setAlerts(prev => [event.payload, ...prev]);
      }
    });
  }, [user]);

  /* ---------------------------
     LOAD GUILDS
  ----------------------------*/
  useEffect(() => {
    if (!user) return;

    fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: "Bearer COOKIE_TOKEN"
      }
    })
      .then(res => res.json())
      .then(setGuilds);
  }, [user]);

  /* ---------------------------
     LOAD SETTINGS
  ----------------------------*/
  async function loadGuild(guild) {
    setSelectedGuild(guild);

    const res = await fetch(`/api/guild/settings?guildId=${guild.id}`);
    const data = await res.json();

    setSettings(data);
  }

  /* ---------------------------
     TOGGLE MODULE
  ----------------------------*/
  async function toggle(module, value) {
    await fetch("/api/guild/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guildId: selectedGuild.id,
        module,
        value
      })
    });

    setSettings(prev => ({
      ...prev,
      [module]: value ? 1 : 0
    }));

    // 🔥 REALTIME SYNC TO WS
    sendWS({
      type: "guild_update",
      botId: "YOUR_BOT_ID",
      guildId: selectedGuild.id,
      config: {
        ...settings,
        [module]: value ? 1 : 0
      }
    });
  }

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-950 text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 p-4">
        <h1 className="text-xl font-bold mb-4">🛡 Vault Security</h1>

        {guilds.map(g => (
          <div
            key={g.id}
            onClick={() => loadGuild(g)}
            className="p-2 hover:bg-gray-800 cursor-pointer rounded"
          >
            {g.name}
          </div>
        ))}
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 p-6 overflow-auto">

        {/* ALERT PANEL */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">🚨 Live Alerts</h2>

          <div className="space-y-2 mt-2">
            {alerts.map((a, i) => (
              <div key={i} className="bg-red-600 p-2 rounded">
                RAID DETECTED — {a.guild?.name} | Level {a.level}
              </div>
            ))}
          </div>
        </div>

        {/* SETTINGS */}
        {!selectedGuild && (
          <h2>Select a server</h2>
        )}

        {settings && (
          <>
            <h2 className="text-2xl mb-4">
              {selectedGuild.name}
            </h2>

            <div className="space-y-3">

              {[
                "anti_nuke",
                "raid_protection",
                "link_filter",
                "audit_logs",
                "intelligence_alerts"
              ].map(mod => (
                <div key={mod} className="flex justify-between bg-gray-800 p-3 rounded">
                  <span>{mod}</span>

                  <button
                    onClick={() => toggle(mod, !settings[mod])}
                    className={`px-3 py-1 rounded ${
                      settings[mod] ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {settings[mod] ? "ON" : "OFF"}
                  </button>
                </div>
              ))}

            </div>
          </>
        )}
      </div>
    </div>
  );
}