import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const SmileDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);

  const onSmileDetected = () => {
    setScore((prevScore) => {
      const newScore = prevScore + 1;
      console.log("Smile detected! Score updated:", newScore);
      localStorage.setItem("currentScore", newScore); // Save score to localStorage
      return newScore;
    });
  };

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = videoRef.current;
        if (!videoElement) {
          console.error("Video element not found.");
          return;
        }
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement.play();
          console.log("Webcam started successfully.");
        };
        await loadModels();
        detectFacesAndSmiles();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };

    const detectFacesAndSmiles = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (!video || !canvas) {
        console.error("Video or canvas not available.");
        return;
      }

      const detect = async () => {
        try {
          if (!faceapi.nets.tinyFaceDetector.isLoaded) {
            console.error("TinyFaceDetector model not loaded.");
            return;
          }

          if (!faceapi.nets.faceExpressionNet.isLoaded) {
            console.error("FaceExpressionNet model not loaded.");
            return;
          }

          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

          const ctx = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          detections.forEach((detection) => {
            const { expressions } = detection;
            if (expressions.happy > 0.7) {
              onSmileDetected();
              const { x, y, width, height } = detection.detection.box;
              ctx.strokeStyle = "green";
              ctx.lineWidth = 3;
              ctx.strokeRect(x, y, width, height);
            } else {
              const { x, y, width, height } = detection.detection.box;
              ctx.strokeStyle = "blue";
              ctx.lineWidth = 3;
              ctx.strokeRect(x, y, width, height);
            }
          });
        } catch (error) {
          console.error("Error detecting faces or smiles:", error);
        }

        requestAnimationFrame(detect);
      };

      detect();
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Empty dependency array ensures initialization only once

  return (
    <div>
      <video
        ref={videoRef}
        style={{
          width: "300px",
          height: "500px",
          objectFit: "cover",
        }}
        muted
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div>Score: {score}</div> {/* Display score */}
    </div>
  );
};

export default SmileDetector;
