import React from "react";

function Dashboard({ currentUser, setScreen }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>✓</div>
        <h1 style={styles.title}>Access Granted</h1>
        <p style={styles.welcome}>
          Welcome back, <b style={{ color: "#1f6feb" }}>{currentUser}</b>
        </p>
        <div style={styles.layersBox}>
          <p style={styles.layersTitle}>Security Layers Passed</p>
          {["Caesar Cipher Password", "Face Recognition", "Fingerprint Scan"].map((l) => (
            <div key={l} style={styles.layerItem}>
              <span style={styles.check}>✓</span>
              <span style={styles.layerText}>{l}</span>
            </div>
          ))}
        </div>
        <button style={styles.logoutBtn} onClick={() => setScreen("landing")}>
          Log Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "2.5rem 2rem", width: 360, textAlign: "center" },
  iconCircle: { width: 64, height: 64, borderRadius: "50%", background: "#3fb950", color: "#fff", fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  title: { color: "#3fb950", fontSize: 24, marginBottom: 8 },
  welcome: { color: "#8b949e", fontSize: 15, marginBottom: 24 },
  layersBox: { background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: "1rem", marginBottom: 16, textAlign: "left" },
  layersTitle: { color: "#8b949e", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 },
  layerItem: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  check: { color: "#3fb950", fontSize: 16, fontWeight: "bold" },
  layerText: { color: "#e6edf3", fontSize: 14 },
  logoutBtn: { width: "100%", padding: "11px 0", background: "transparent", color: "#f85149", border: "1px solid #f85149", borderRadius: 8, fontSize: 14, cursor: "pointer" },
};

export default Dashboard;