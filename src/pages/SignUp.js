import React, { useState } from "react";
import FaceScan from "../components/FaceScan";
import FingerprintScan from "../components/FingerprintScan";
import { caesarEncrypt } from "../utils/caesar";

const API = "https://securevault-backend-production-e51b.up.railway.app";

function SignUp({ setScreen }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFaceDone = () => setStep(2);
  const handleFingerprintDone = () => setStep(3);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    const encrypted = caesarEncrypt(password);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: encrypted }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Account created! Please log in.");
        setScreen("landing");
      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (e) {
      setError("Cannot connect to server.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.steps}>
          {["Face", "Fingerprint", "Credentials"].map((s, i) => (
            <div key={s} style={styles.stepItem}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? "#3fb950" : step === i + 1 ? "#1f6feb" : "#21262d",
                color: step >= i + 1 ? "#fff" : "#8b949e",
              }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span style={styles.stepLabel}>{s}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 style={styles.heading}>Scan Your Face</h2>
            <p style={styles.sub}>Click the button to scan</p>
            <FaceScan onDone={handleFaceDone} />
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={styles.heading}>Scan Fingerprint</h2>
            <p style={styles.sub}>Use your device biometrics</p>
            <FingerprintScan onDone={handleFingerprintDone} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={styles.heading}>Create Account</h2>
            <p style={styles.sub}>Set your username and password</p>
            <input
              style={styles.input}
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <p style={styles.cipher}>
                🔒 Encrypted: <b>{caesarEncrypt(password)}</b>
              </p>
            )}
            {error && <p style={styles.error}>{error}</p>}
            <button
              style={{ ...styles.btn, background: loading ? "#21262d" : "#1f6feb" }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        )}

        <button style={styles.back} onClick={() => setScreen("landing")}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#161b22", border: "1px solid #30363d", borderRadius: 16, padding: "2rem", width: 360 },
  steps: { display: "flex", justifyContent: "center", gap: 16, marginBottom: 24 },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  stepCircle: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 },
  stepLabel: { fontSize: 11, color: "#8b949e" },
  heading: { color: "#e6edf3", fontSize: 20, marginBottom: 6, textAlign: "center" },
  sub: { color: "#8b949e", fontSize: 13, textAlign: "center", marginBottom: 20 },
  input: { width: "100%", padding: "10px 12px", background: "#0d1117", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 14, marginBottom: 12, boxSizing: "border-box" },
  cipher: { color: "#8b949e", fontSize: 12, marginBottom: 12 },
  error: { color: "#f85149", fontSize: 13, marginBottom: 12 },
  btn: { width: "100%", padding: "11px 0", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer", marginBottom: 12 },
  back: { background: "none", border: "none", color: "#8b949e", fontSize: 13, cursor: "pointer", marginTop: 8 },
};

export default SignUp;