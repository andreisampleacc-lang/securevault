import React, { useState } from "react";

function FaceScan({ onDone }) {
  const [status, setStatus] = useState("ready");
  const [progress, setProgress] = useState(0);

  const handleScan = () => {
    setStatus("scanning");
    setProgress(0);

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      setProgress(Math.min(Math.round(prog), 100));
      if (prog >= 100) {
        clearInterval(interval);
        setProgress(100);
        setStatus("success");
        setTimeout(() => onDone(), 1000);
      }
    }, 150);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.iconBox}>
        {status === "success" ? (
          <div style={styles.successCircle}>✓</div>
        ) : (
          <div style={{
            ...styles.faceCircle,
            borderColor: status === "scanning" ? "#1f6feb" : "#30363d",
          }}>
            <span style={{ fontSize: 40 }}>👤</span>
          </div>
        )}
      </div>

      {status === "scanning" && (
        <div style={styles.progressBox}>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <p style={styles.progressText}>Scanning face... {progress}%</p>
        </div>
      )}

      {status === "ready" && (
        <p style={styles.hint}>Click the button to simulate face scan</p>
      )}

      {status === "success" && (
        <p style={styles.successText}>✓ Face Verified!</p>
      )}

      {status === "ready" && (
        <button style={styles.btn} onClick={handleScan}>
          Scan Face
        </button>
      )}

      {status === "scanning" && (
        <button style={{ ...styles.btn, background: "#21262d", cursor: "not-allowed" }} disabled>
          Scanning...
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 },
  iconBox: { display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem 0" },
  faceCircle: { width: 100, height: 100, borderRadius: "50%", border: "2px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" },
  successCircle: { width: 100, height: 100, borderRadius: "50%", background: "#3fb950", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 40, fontWeight: "bold" },
  progressBox: { width: "100%" },
  progressBg: { background: "#21262d", borderRadius: 4, height: 6, marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 4, background: "#1f6feb", transition: "width 0.2s" },
  progressText: { color: "#8b949e", fontSize: 12, textAlign: "center", margin: 0 },
  hint: { color: "#8b949e", fontSize: 12, textAlign: "center", margin: 0 },
  successText: { color: "#3fb950", fontSize: 14, fontWeight: "bold", margin: 0 },
  btn: { width: "100%", padding: "11px 0", background: "#1f6feb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" },
};

export default FaceScan;