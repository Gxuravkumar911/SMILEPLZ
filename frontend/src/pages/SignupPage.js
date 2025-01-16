import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
} from "@mui/material";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/register", { username, password });
      alert("Signup successful! You can now log in.");
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      navigate("/smile");
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://source.unsplash.com/featured/?smile')", // Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            padding: "30px",
            borderRadius: "15px",
            backdropFilter: "blur(5px)", // Slight blur effect
            backgroundColor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "#4CAF50",
              marginBottom: 2,
            }}
          >
            SmileToEarn
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: "medium",
              marginBottom: 4,
            }}
          >
            Earn rewards with every smile you share!
          </Typography>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  onClick={handleSignup}
                >
                  Signup
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
