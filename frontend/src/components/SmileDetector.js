import React, { useRef, useEffect, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Box, Typography, Button, CircularProgress, Stack } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshIcon from "@mui/icons-material/Refresh";

const SMILE_THRESHOLD = 0.7;
const MIN_SMILE_INTERVAL_MS = 100;

const SmileDetector = ({
  onSmile,
  onStrength,
  onStateChange,
  paused = false,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);
  const lastSmileAtRef = useRef(0);
  const pausedRef = useRef(paused);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const setAndEmit = useCallback((s) => {
    setStatus(s);
    onStateChange?.(s);
  }, [onStateChange]);

  const stopStream = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setAndEmit("loading-models");
    try {
      if (!faceapi.nets.tinyFaceDetector.isLoaded) {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      }
      if (!faceapi.nets.faceExpressionNet.isLoaded) {
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      }
    } catch (e) {
      setError("Couldn't load the smile model. Check your connection and refresh.");
      setAndEmit("error");
      return;
    }

    setAndEmit("requesting-camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await new Promise((r) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          r();
        };
      });
    } catch (e) {
      setError("Camera access denied. Allow it in your browser to start smiling.");
      setAndEmit("denied");
      return;
    }

    setAndEmit("running");
    const detect = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
          .withFaceExpressions();

        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let topHappy = 0;
        detections.forEach((d) => {
          const happy = d.expressions?.happy ?? 0;
          if (happy > topHappy) topHappy = happy;

          const { x, y, width, height } = d.detection.box;
          const isSmiling = happy >= SMILE_THRESHOLD;

          ctx.strokeStyle = isSmiling ? "rgba(34, 197, 94, 0.95)" : "rgba(124, 92, 255, 0.85)";
          ctx.lineWidth = 4;
          ctx.shadowColor = isSmiling ? "rgba(34, 197, 94, 0.7)" : "rgba(124, 92, 255, 0.5)";
          ctx.shadowBlur = isSmiling ? 24 : 12;

          const r = 18;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + width - r, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + r);
          ctx.lineTo(x + width, y + height - r);
          ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
          ctx.lineTo(x + r, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.stroke();
        });

        onStrength?.(topHappy);
        if (
          !pausedRef.current &&
          topHappy >= SMILE_THRESHOLD &&
          performance.now() - lastSmileAtRef.current >= MIN_SMILE_INTERVAL_MS
        ) {
          lastSmileAtRef.current = performance.now();
          onSmile?.(topHappy);
        }
      } catch (e) {
        // tolerate transient detection errors
      }
      rafRef.current = requestAnimationFrame(detect);
    };

    rafRef.current = requestAnimationFrame(detect);
  }, [onSmile, onStrength, setAndEmit]);

  useEffect(() => {
    start();
    return () => stopStream();
  }, [start, stopStream]);

  const retry = () => {
    stopStream();
    start();
  };

  const isOverlay = status !== "running";

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
        maxWidth: 560,
        mx: "auto",
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "rgba(26, 21, 48, 0.92)",
        boxShadow: "0 30px 60px rgba(26, 21, 48, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        muted
        playsInline
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scaleX(-1)",
        }}
      />
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transform: "scaleX(-1)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(26,21,48,0.45) 0%, rgba(26,21,48,0) 25%, rgba(26,21,48,0) 65%, rgba(26,21,48,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {isOverlay && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            backgroundColor: "rgba(26, 21, 48, 0.85)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            p: 4,
            textAlign: "center",
          }}
        >
          {status === "loading-models" && (
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: "#FF8AB0" }} />
              <Typography variant="h6">Loading the smile model…</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>This only happens once.</Typography>
            </Stack>
          )}
          {status === "requesting-camera" && (
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: "#FF8AB0" }} />
              <Typography variant="h6">Asking for camera access…</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 320 }}>
                We never upload your video. Detection runs entirely in your browser.
              </Typography>
            </Stack>
          )}
          {(status === "denied" || status === "error") && (
            <Stack spacing={2} alignItems="center" sx={{ maxWidth: 360 }}>
              <VideocamOffIcon sx={{ fontSize: 48, color: "#FF8AB0" }} />
              <Typography variant="h6">{status === "denied" ? "Camera blocked" : "Something broke"}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{error}</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={retry}
              >
                Try again
              </Button>
            </Stack>
          )}
          {status === "idle" && (
            <Stack spacing={2} alignItems="center">
              <CircularProgress sx={{ color: "#FF8AB0" }} />
              <Typography variant="h6">Warming up…</Typography>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SmileDetector;
