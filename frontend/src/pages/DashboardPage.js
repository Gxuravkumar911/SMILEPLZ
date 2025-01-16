import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Container,
} from "@mui/material";

const DashboardPage = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [score, setScore] = useState(0);
  const [userData, setUserData] = useState({ score: 0, maxScore: 0, earnings: 0 });

  useEffect(() => {
    const currentScore = parseInt(localStorage.getItem("currentScore")) || 0;
    setScore(currentScore);

    const updateScore = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/updateScore", {
          username,
          newScore: currentScore,
        });
        setUserData(res.data.user);
      } catch (err) {
        console.error("Error updating score:", err);
        alert("Failed to update score.");
      }
    };

    if (username && currentScore > 0) {
      updateScore();
    }
  }, [username]);

  return (
    <Container maxWidth="lg" style={{ marginTop: "40px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome, {username}!
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Here’s a quick overview of your progress:
      </Typography>

      <Grid container spacing={4} style={{ marginTop: "20px" }}>
        {/* Current Score Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderLeft: "6px solid #4CAF50",
              backgroundColor: "#F0FFF0",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6">Current Score</Typography>
              <Typography variant="h4" color="primary">
                {userData.score}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Max Score Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderLeft: "6px solid #2196F3",
              backgroundColor: "#E3F2FD",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6">Max Score</Typography>
              <Typography variant="h4" color="secondary">
                {userData.maxScore}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Earnings Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderLeft: "6px solid #FFC107",
              backgroundColor: "#FFFDE7",
              height: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6">Earnings</Typography>
              <Typography variant="h4" style={{ color: "#FF9800" }}>
                ${userData.earnings.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Buttons */}
      <Box textAlign="center" style={{ marginTop: "30px" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/leaderboard")}
        >
          Show Leaderboard
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={() => navigate("/smile")}
        >
          Back to Smiling
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardPage;
