export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0a0a0a",
      color: "white",
      flexDirection: "column"
    }}>
      <h1>🛡 Vault Security Dashboard</h1>

      <a
        href="/dashboard"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "green",
          borderRadius: 8,
          color: "white",
          textDecoration: "none"
        }}
      >
        Open Dashboard
      </a>
    </div>
  );
}