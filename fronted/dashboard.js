const WS_URL = "ws://localhost:8080";

let ws = null;
let user = null;
let guilds = [];
let selectedGuild = null;

/* ---------------------------
   INIT WS
----------------------------*/
function initWS() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "dashboard_register",
      userId: user.id
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.type === "security_alert") {
      alert(`🚨 RAID: ${data.payload.guild.name}`);
    }

    if (data.type === "guild_update") {
      console.log("Config updated live", data);
    }
  };
}

/* ---------------------------
   LOAD USER
----------------------------*/
async function loadUser() {
  const token = localStorage.getItem("vault_token");

  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  user = await res.json();
  initWS();
}

/* ---------------------------
   LOAD GUILDS
----------------------------*/
async function loadGuilds() {
  const token = localStorage.getItem("vault_token");

  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  guilds = await res.json();

  const container = document.getElementById("guilds");

  guilds.forEach(g => {
    const div = document.createElement("div");
    div.innerText = g.name;
    div.className = "guild";

    div.onclick = () => loadSettings(g);

    container.appendChild(div);
  });
}

/* ---------------------------
   LOAD SETTINGS
----------------------------*/
async function loadSettings(guild) {
  selectedGuild = guild;

  const res = await fetch(
    `https://vault-dashboard-zeta.vercel.app/api/guild/settings?guildId=${guild.id}`
  );

  const data = await res.json();

  renderSettings(data);
}

/* ---------------------------
   TOGGLE MODULE + WS SYNC
----------------------------*/
async function toggle(module, value) {
  await fetch("https://vault-dashboard-zeta.vercel.app/api/guild/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guildId: selectedGuild.id,
      module,
      value
    })
  });

  // 🔥 REALTIME WS SYNC
  ws.send(JSON.stringify({
    type: "guild_update",
    botId: "BOT_ID",
    guildId: selectedGuild.id,
    config: {
      [module]: value
    }
  }));
}

/* ---------------------------
   INIT
----------------------------*/
loadUser().then(loadGuilds);