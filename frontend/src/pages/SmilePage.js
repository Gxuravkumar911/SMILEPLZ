import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SmileDetector from "../components/SmileDetector";
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";

const SmilePage = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const username = localStorage.getItem("username");

  // Fetch max score on component mount
  useEffect(() => {
    const fetchMaxScore = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/users/getMaxScore", { username });
        setMaxScore(response.data.maxScore);
      } catch (error) {
        console.error("Error fetching max score:", error);
      }
    };

    if (username) {
      fetchMaxScore();
    }
  }, [username]);

  const handleStop = () => {
    console.log("Final score before navigation:", score); // For debugging
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, textAlign: "center" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to <span style={{ color: "green", fontWeight:"bold", fontFamily:'cursive' }}>SMILEPLZ!</span>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Smile hard, you can be the next WINNER!
        </Typography>

        {/* SmileDetector Component */}
      
        {/* Score Display */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{fontFamily:'cursive'}} variant="h6" color="black">
            <strong><SmileDetector onSmileDetected={() => setScore((prev) => prev + 1)} /></strong>
          </Typography>
          <Typography sx={{fontFamily:'cursive'}} variant="h5" color="green">
            Max Score: <strong>{maxScore}</strong>
          </Typography>
        </Box>

        {/* Stop Button */}
        <Button
          variant="contained"
          color="success"
          size="large"
          onClick={handleStop}
          sx={{ px: 4, py: 1 }}
        >
          Stop Smiling
        </Button>
      </Paper>
    </Container>
  );
};

export default SmilePage;
