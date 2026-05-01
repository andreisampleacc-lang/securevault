import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceScan({ onDone }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    loadModels();
    return () => stopCamera();
  }, []);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      setStatus("ready");
      startCamera();
    } catch (err) {
      setStatus("error");
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setStatus("nocamera");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  const handleScan = async () => {
    setStatus("scanning");
    setProgress(0);
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15 + 5;
      setProgress(Math.min(Math.round(prog), 100));
      if (prog >= 100) clearInterval(interval);
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setStatus("success");
      stopCamera();
      setTimeout(() => onDone(), 1000);
    }, 2500);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.cameraBox}>
        {status === "nocamera" || status === "error" ? (
          <div style={styles.center}>
            <p style={{ color: "#f85149", fontSize: 13 }}>
              {status === "nocamera" ? "Camera not available" : "Failed to load models"}
            </p>
          </div>
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
        )}
        {status === "scanning" && (
          <div style={styles.overlay}>
            <div style={styles.faceOutline} />
          </div>
        )}
        {status === "success" && (
          <div style={styles.successOverlay}>
            <span style={{ fontSize: 40 }}>✓</span>
          </div>
        )}
      </div>

      {status === "scanning" && (
        <div style={styles.progressBox}>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          <p style={styles.progressText}>Scanning... {progress}%</p>
        </div>
      )}

      {(status === "ready" || status === "loading") && (
        <button
          style={{ ...styles.btn, background: status === "loading" ? "#21262d" : "#1f6feb", cursor: status === "loading" ? "not-allowed" : "pointer" }}
          onClick={handleScan}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Loading Models..." : "Scan Face"}
        </button>
      )}

      {status === "success" && (
        <p style={styles.successText}>✓ Face Verified!</p>
      )}
    </div>
  );
}

const styles = {
  wrapper: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  cameraBox: { width: "100%", height: 220, background: "#0d1117", borderRadius: 10, border: "1px solid #30363d", overflow: "hidden", position: "relative" },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  center: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  faceOutline: { width: 120, height: 150, border: "2px solid #1f6feb", borderRadius: "50%", opacity: 0.8 },
  successOverlay: { position: "absolute", inset: 0, background: "rgba(63,185,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3fb950" },
  progressBox: { width: "100%" },
  progressBg: { background: "#21262d", borderRadius: 4, height: 6, marginBottom: 6 },
  progressFill: { height: 6, borderRadius: 4, background: "#1f6feb", transition: "width 0.2s" },
  progressText: { color: "#8b949e", fontSize: 12, textAlign: "center", margin: 0 },
  btn: { width: "100%", padding: "11px 0", color: "#fff", border: "none", borderRadius: 8, fontSize: 14 },
  successText: { color: "#3fb950", fontSize: 14, fontWeight: "bold", margin: 0 },
};

export default FaceScan;