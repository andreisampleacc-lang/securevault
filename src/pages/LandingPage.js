import React from "react";

function LandingPage({ setScreen }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 SecureVault</h1>
        <p style={styles.subtitle}>
          Triple-layer authentication system
        </p>
        <div style={styles.badges}>
          <span style={styles.badge}>👤 Face ID</span>
          <span style={styles.badge}>👆 Fingerprint</span>
          <span style={styles.badge}>🔑 Cipher Key</span>
        </div>
        <button
          style={styles.loginBtn}
          onClick={() => setScreen("login")}
        >
          Log In
        </button>
        <button
          style={styles.signupBtn}
          onClick={() => setScreen("signup")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0d1117",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: 16,
    padding: "3rem 2.5rem",
    width: 340,
    textAlign: "center",
  },
  title: {
    color: "#e6edf3",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: "#8b949e",
    fontSize: 14,
    marginBottom: 24,
  },
  badges: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  badge: {
    background: "#21262d",
    color: "#8b949e",
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid #30363d",
  },
  loginBtn: {
    width: "100%",
    padding: "12px 0",
    background: "#1f6feb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
    marginBottom: 12,
  },
  signupBtn: {
    width: "100%",
    padding: "12px 0",
    background: "transparent",
    color: "#1f6feb",
    border: "1px solid #1f6feb",
    borderRadius: 8,
    fontSize: 15,
    cursor: "pointer",
  },
};

export default LandingPage;