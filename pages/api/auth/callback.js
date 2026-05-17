import axios from "axios";
import { serialize } from "cookie";

export default async function handler(req, res) {
  const code = req.query.code;

  const tokenRes = await axios.post(
    "https://discord.com/api/oauth2/token",
    new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const userRes = await axios.get("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${tokenRes.data.access_token}`
    }
  });

  res.setHeader(
    "Set-Cookie",
    serialize("vault_user", JSON.stringify(userRes.data), {
      path: "/",
      httpOnly: true
    })
  );

  res.redirect("/dashboard");
}