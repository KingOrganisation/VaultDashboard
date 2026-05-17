const CLIENT_ID = "YOUR_DISCORD_CLIENT_ID";
const REDIRECT_URI = "https://vault-dashboard-zeta.vercel.app/callback.html";

document.getElementById("loginBtn").onclick = () => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify%20guilds`;

  window.location.href = url;
};