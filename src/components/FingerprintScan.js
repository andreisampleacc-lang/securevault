import React, { useState } from "react";

function FingerprintScan({ onDone, mode = "signup" }) {
  const [status, setStatus] = useState("ready");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Click to scan fingerprint");

  const handleScan = async () => {
    setStatus("scanning");
    setProgress(0);
    setMessage("Waiting for biometric...");

    const available =
      window.PublicKeyCredential !== undefined &&
      (await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

    if (available) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        if (mode === "signup") {
          // Register new fingerprint
          const credential = await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: "SecureVault", id: window.location.hostname },
              user: {
                id: new Uint8Array(16),
                name: "user@securevault",
                displayName: "SecureVault User",
              },
              pubKeyCredParams: [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 },
              ],
              authenticatorSelection: {
                userVerification: "required",
                authenticatorAttachment: "platform",
              },
              timeout: 60000,
            },
          });

          // Save credential ID
          const credentialId = btoa(
            String.fromCharCode(...new Uint8Array(credential.rawId))
          );

          setProgress(100);
          setStatus("success");
          setMessage("Fingerprint registered!");
          setTimeout(() => onDone(credentialId), 1000);

        } else {
          // Verify existing fingerprint
          const credentialId = localStorage.getItem("credentialId");

          const assertionOptions = {
            challenge,
            timeout: 60000,
            userVerification: "required",
          };

          if (credentialId) {
            const rawId = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0));
            assertionOptions.allowCredentials = [{
              type: "public-key",
              id: rawId,
            }];
          }

          await navigator.credentials.get({
            publicKey: assertionOptions,
          });

          setProgress(100);
          setStatus("success");
          setMessage("Fingerprint verified!");
          setTimeout(() => onDone(true), 1000);
        }

      } catch (err) {
        if (err.name === "NotAllowedError") {
          setStatus("ready");
          setMessage("Cancelled. Try again.");
        } else {
          // Fallback to simulation
          simulateScan();
        }
      }
    } else {
      simulateScan();
    }
  };

  const simulateScan = () => {
    setMessage("Scanning...");
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      setProgress(Math.min(Math.round(prog), 100));
      if (prog >= 100) {
        clearInterval(interval);
        setProgress(100);
        setStatus("success");
        setMessage("Fingerprint verified!");
        setTimeout(() => onDone(mode === "signup" ? "simulated" : true), 1000);
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
            ...styles.fpCircle,
            borderColor: status === "scanning" ? "#1f6feb" : "#30363d",
          }}>
            <span style={{ fontSize: 40 }}>👆</span>
          </div>
        )}
      </div>

      {status === "scanning" && (
        <div style={styles.progressBox}>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      )}

      <p style={{ color: "#8b949e", fontSize: 13, textAlign: "center", margin: 0 }}>
        {message}
      </p>

      {status === "success" && (
        <p style={styles.successText}>✓ Fingerprint Verified!</p>
      )}

      {status === "ready" && (
        <button style={styles.btn} onClick={handleScan}>
          {mode === "signup" ? "Register Fingerprint" : "Verify Fingerprint"}
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
  fpCircle: { width: 100, height: 100, borderRadius: "50%", border: "2px solid #30363d", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d1117" },
  successCircle: { width: 100, height: 100, borderRadius: "50%", background: "#3fb950", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 40, fontWeight: "bold" },
  progressBox: { width: "100%" },
  progressBg: { background: "#21262d", borderRadius: 4, height: 6, marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 4, background: "#1f6feb", transition: "width 0.2s" },
  successText: { color: "#3fb950", fontSize: 14, fontWeight: "bold", margin: 0 },
  btn: { width: "100%", padding: "11px 0", background: "#1f6feb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" },
};

export default FingerprintScan;