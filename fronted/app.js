let selectedGuild = null;

/* ---------------------------
   LOAD GUILDS
----------------------------*/
async function loadGuilds() {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: "Bearer TOKEN"
    }
  });

  const guilds = await res.json();

  const container = document.getElementById("guilds");

  guilds.forEach(g => {
    const div = document.createElement("div");
    div.className = "guild";
    div.innerText = g.name;

    div.onclick = () => loadSettings(g);

    container.appendChild(div);
  });
}

/* ---------------------------
   LOAD SETTINGS
----------------------------*/
async function loadSettings(guild) {
  selectedGuild = guild;

  document.getElementById("title").innerText = guild.name;

  const res = await fetch(
    `https://vault-dashboard-zeta.vercel.app/api/guild/settings?guildId=${guild.id}`
  );

  const data = await res.json();

  renderSettings(data);
}

/* ---------------------------
   RENDER SETTINGS
----------------------------*/
function renderSettings(settings) {
  const container = document.getElementById("settings");
  container.innerHTML = "";

  ["anti_nuke", "raid_protection", "link_filter", "audit_logs"].forEach(m => {

    const btn = document.createElement("button");

    btn.innerText = `${m}: ${settings[m] ? "ON" : "OFF"}`;

    btn.onclick = async () => {
      await fetch("https://vault-dashboard-zeta.vercel.app/api/guild/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guildId: selectedGuild.id,
          module: m,
          value: !settings[m]
        })
      });

      settings[m] = !settings[m];
      renderSettings(settings);
    };

    container.appendChild(btn);
  });
}

/* INIT */
loadGuilds();