import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

function FaceScan({ onDone }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("loading");
  const [stream, setStream] = useState(null);
  const [message, setMessage] = useState("Loading face detection...");

  useEffect(() => {
    loadModels();
    return () => stopCamera();
  }, []);

  const loadModels = async () => {
    try {
      setMessage("Loading face detection models...");
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      setStatus("ready");
      setMessage("Click Scan to start");
      startCamera();
    } catch (err) {
      setStatus("error");
      setMessage("Failed to load models");
    }
  };

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setStatus("nocamera");
      setMessage("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
  };

  const handleScan = async () => {
    setStatus("scanning");
    setMessage("Detecting face...");

    try {
      const detection = await faceapi.detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detection) {
        setStatus("success");
        setMessage("Face detected!");
        stopCamera();
        setTimeout(() => onDone(), 1000);
      } else {
        setStatus("ready");
        setMessage("No face detected. Try again!");
      }
    } catch (err) {
      setStatus("ready");
      setMessage("Detection failed. Try again!");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.cameraBox}>
        {status === "nocamera" || status === "error" ? (
          <div style={styles.center}>
            <p style={{ color: "#f85149", fontSize: 13 }}>{message}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={styles.video}
          />
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

      <p style={{ color: "#8b949e", fontSize: 13, textAlign: "center", margin: 0 }}>
        {message}
      </p>

      {(status === "ready") && (
        <button style={styles.btn} onClick={handleScan}>
          Scan Face
        </button>
      )}

      {status === "loading" && (
        <button style={{ ...styles.btn, background: "#21262d", cursor: "not-allowed" }} disabled>
          Loading...
        </button>
      )}

      {status === "scanning" && (
        <button style={{ ...styles.btn, background: "#21262d", cursor: "not-allowed" }} disabled>
          Detecting...
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
  cameraBox: { width: "100%", height: 280, background: "#0d1117", borderRadius: 10, border: "1px solid #30363d", overflow: "hidden", position: "relative" },
  video: { width: "100%", height: "100%", objectFit: "cover" },
  center: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  faceOutline: { width: 150, height: 180, border: "3px solid #1f6feb", borderRadius: "50%", opacity: 0.8 },
  successOverlay: { position: "absolute", inset: 0, background: "rgba(63,185,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3fb950" },
  successText: { color: "#3fb950", fontSize: 14, fontWeight: "bold", margin: 0 },
  btn: { width: "100%", padding: "11px 0", background: "#1f6feb", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" },
};

export default FaceScan;