import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  InputAdornment,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Logo, { SmileMark } from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const passwordStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s += 25;
  if (pw.length >= 12) s += 15;
  if (/[A-Z]/.test(pw)) s += 20;
  if (/[0-9]/.test(pw)) s += 20;
  if (/[^A-Za-z0-9]/.test(pw)) s += 20;
  return Math.min(100, s);
};

const strengthLabel = (s) => {
  if (s < 30) return { label: "Weak", color: "error.main" };
  if (s < 60) return { label: "Okay", color: "warning.main" };
  if (s < 85) return { label: "Strong", color: "success.main" };
  return { label: "Very strong", color: "success.dark" };
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login, register, isAuthenticated } = useAuth();

  const initialMode = new URLSearchParams(location.search).get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/smile", { replace: true });
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Pick a username.";
    else if (username.length < 3) e.username = "At least 3 characters.";
    if (!password) e.password = "Password is required.";
    else if (mode === "signup" && password.length < 6) e.password = "At least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await register(username, password);
        toast.success("Account ready! Logging you in…");
        await login(username, password);
        navigate("/smile");
      } else {
        await login(username, password);
        navigate("/smile");
      }
    } catch (err) {
      const msg = err?.message || "Something went wrong.";
      toast.error(mode === "signup" ? `Signup failed — ${msg}` : `Login failed — ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const strength = passwordStrength(password);
  const strengthInfo = strengthLabel(strength);

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          background: "linear-gradient(135deg, #FF5F8F 0%, #7C5CFF 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box component={Link} to="/" sx={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <Logo color="#fff" />
        </Box>

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h2" sx={{ fontSize: 56, mb: 2, color: "#fff" }}>
            Make today<br />measurably happier.
          </Typography>
          <Typography sx={{ opacity: 0.9, fontSize: 18, maxWidth: 420 }}>
            Every smile counts. Literally. The leaderboard's waiting and your face is the only key.
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} sx={{ position: "relative", zIndex: 1, opacity: 0.8 }}>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 800 }}>10k+</Typography>
            <Typography variant="caption">smiles a day</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 800 }}>0</Typography>
            <Typography variant="caption">video uploads. ever.</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, fontWeight: 800 }}>∞</Typography>
            <Typography variant="caption">grin potential</Typography>
          </Box>
        </Stack>

        <Box sx={{ position: "absolute", top: -80, right: -80, opacity: 0.18 }}>
          <SmileMark size={300} />
        </Box>
        <Box sx={{ position: "absolute", bottom: -60, left: -60, opacity: 0.12 }}>
          <SmileMark size={220} />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 420 }}>
          <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
            <Box component={Link} to="/" sx={{ textDecoration: "none" }}>
              <Logo />
            </Box>
          </Box>

          <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: 32, md: 40 } }}>
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            {mode === "signup"
              ? "Smile your way onto the leaderboard."
              : "We've missed your grin."}
          </Typography>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={mode}
            onChange={(_, v) => v && setMode(v)}
            sx={{
              mb: 4,
              p: 0.5,
              bgcolor: "rgba(26, 21, 48, 0.04)",
              borderRadius: 999,
              "& .MuiToggleButton-root": {
                border: 0,
                borderRadius: "999px !important",
                py: 1,
                fontWeight: 700,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "background.paper",
                  color: "text.primary",
                  boxShadow: "0 4px 14px rgba(26, 21, 48, 0.10)",
                  "&:hover": { bgcolor: "background.paper" },
                },
              },
            }}
          >
            <ToggleButton value="login">Log in</ToggleButton>
            <ToggleButton value="signup">Sign up</ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={Boolean(errors.username)}
                helperText={errors.username}
                disabled={submitting}
              />
              <Box>
                <TextField
                  label="Password"
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  disabled={submitting}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPw((v) => !v)}
                            edge="end"
                            size="small"
                            tabIndex={-1}
                          >
                            {showPw ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                {mode === "signup" && password && (
                  <Box sx={{ mt: 1.25 }}>
                    <LinearProgress
                      variant="determinate"
                      value={strength}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(26, 21, 48, 0.06)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 3,
                          backgroundColor: strengthInfo.color,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: strengthInfo.color, fontWeight: 600, mt: 0.5, display: "block" }}>
                      {strengthInfo.label}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={submitting}
                endIcon={!submitting && <ArrowForwardIcon />}
                sx={{ mt: 1 }}
              >
                {submitting ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : mode === "signup" ? (
                  "Create account"
                ) : (
                  "Log in"
                )}
              </Button>

              <Typography variant="caption" align="center" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                By continuing you agree to be the happiest version of yourself.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthPage;
