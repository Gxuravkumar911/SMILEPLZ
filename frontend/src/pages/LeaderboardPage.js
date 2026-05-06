import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/client";
import { useToast } from "../components/Toast";

const podiumOrder = [1, 0, 2];
const podiumColors = [
  { bg: "linear-gradient(135deg, #FFD700, #FFB627)", height: 140, label: "1st" },
  { bg: "linear-gradient(135deg, #E5E7EB, #C0C0C0)", height: 110, label: "2nd" },
  { bg: "linear-gradient(135deg, #FBBF77, #CD7F32)", height: 90, label: "3rd" },
];

const initialOf = (name) => (name || "?").charAt(0).toUpperCase();
const avatarGradient = (name) => {
  const palette = [
    "linear-gradient(135deg, #FF8AB0, #FF5F8F)",
    "linear-gradient(135deg, #A289FF, #7C5CFF)",
    "linear-gradient(135deg, #FFCB5C, #FFB627)",
    "linear-gradient(135deg, #4ADE80, #22C55E)",
    "linear-gradient(135deg, #67E8F9, #06B6D4)",
  ];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const { username, isAuthenticated } = useAuth();
  const toast = useToast();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await userApi.leaderboard();
      setLeaders(res.data || []);
    } catch (err) {
      toast.error("Couldn't load the leaderboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);
  const myRank = leaders.findIndex((u) => u.username === username);
  const me = myRank >= 0 ? leaders[myRank] : null;

  return (
    <AppShell>
      <Box sx={{ maxWidth: 980, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, mb: 0.5 }}>
              Leaderboard
            </Typography>
            <Typography color="text.secondary">
              The happiest humans on the internet, ranked.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => load(true)} disabled={refreshing}>
                <RefreshIcon
                  sx={{
                    transition: "transform 600ms ease",
                    transform: refreshing ? "rotate(360deg)" : "none",
                  }}
                />
              </IconButton>
            </Tooltip>
            {isAuthenticated && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayCircleIcon />}
                onClick={() => navigate("/smile")}
              >
                Smile to climb
              </Button>
            )}
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : leaders.length === 0 ? (
          <Box
            sx={{
              p: 6,
              borderRadius: 5,
              textAlign: "center",
              bgcolor: "background.paper",
              border: "1px solid rgba(26, 21, 48, 0.06)",
            }}
          >
            <Typography sx={{ fontSize: 64, mb: 1 }}>🫥</Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>The board is empty.</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Be the first smiling face on the wall.
            </Typography>
            {isAuthenticated && (
              <Button variant="contained" color="primary" onClick={() => navigate("/smile")}>
                Start smiling
              </Button>
            )}
          </Box>
        ) : (
          <>
            {top3.length > 0 && (
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 6,
                  background: "linear-gradient(135deg, rgba(255,95,143,0.10), rgba(124,92,255,0.10))",
                  border: "1px solid rgba(26, 21, 48, 0.06)",
                  mb: 4,
                }}
              >
                <Stack
                  direction="row"
                  spacing={{ xs: 1.5, sm: 3 }}
                  justifyContent="center"
                  alignItems="flex-end"
                >
                  {podiumOrder.map((idx) => {
                    const u = top3[idx];
                    const cfg = podiumColors[idx];
                    if (!u) return null;
                    return (
                      <Stack key={u.username} alignItems="center" spacing={1.25} sx={{ flex: 1, maxWidth: 220 }}>
                        <Avatar
                          sx={{
                            width: { xs: 56, sm: 72 },
                            height: { xs: 56, sm: 72 },
                            background: avatarGradient(u.username),
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: { xs: 22, sm: 28 },
                            boxShadow: idx === 0 ? "0 12px 28px rgba(255,183,39,0.45)" : "0 8px 20px rgba(26, 21, 48, 0.16)",
                            border: "3px solid #fff",
                          }}
                        >
                          {initialOf(u.username)}
                        </Avatar>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: 14, sm: 16 } }}>
                            {u.username}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {u.maxScore} smiles
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: cfg.height,
                            borderRadius: "16px 16px 6px 6px",
                            background: cfg.bg,
                            display: "grid",
                            placeItems: "center",
                            color: "#1A1530",
                            fontFamily: '"Fraunces", Georgia, serif',
                            fontWeight: 800,
                            fontSize: { xs: 28, sm: 36 },
                            boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.08), 0 8px 18px rgba(26,21,48,0.10)",
                            position: "relative",
                          }}
                        >
                          {idx === 0 && (
                            <EmojiEventsIcon sx={{ position: "absolute", top: 6, fontSize: 18, color: "rgba(0,0,0,0.45)" }} />
                          )}
                          {cfg.label}
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              </Box>
            )}

            <Box
              sx={{
                p: 1,
                borderRadius: 5,
                bgcolor: "background.paper",
                border: "1px solid rgba(26, 21, 48, 0.06)",
                overflow: "hidden",
              }}
            >
              {rest.length === 0 ? (
                <Box sx={{ p: 4, textAlign: "center" }}>
                  <Typography color="text.secondary">That's everyone on the board so far.</Typography>
                </Box>
              ) : (
                rest.map((u, i) => {
                  const place = i + 4;
                  const isMe = u.username === username;
                  return (
                    <Stack
                      key={u.username}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: isMe ? "rgba(255, 95, 143, 0.08)" : "transparent",
                        border: isMe ? "1px solid rgba(255, 95, 143, 0.2)" : "1px solid transparent",
                        transition: "background 200ms ease",
                        "&:hover": { bgcolor: isMe ? "rgba(255, 95, 143, 0.12)" : "rgba(26, 21, 48, 0.04)" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          textAlign: "center",
                          fontFamily: '"Fraunces", Georgia, serif',
                          fontWeight: 700,
                          fontSize: 20,
                          color: "text.secondary",
                        }}
                      >
                        {place}
                      </Box>
                      <Avatar sx={{ background: avatarGradient(u.username), color: "#fff", fontWeight: 700 }}>
                        {initialOf(u.username)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ fontWeight: 700 }}>
                          {u.username}{isMe && (
                            <Chip
                              size="small"
                              label="you"
                              sx={{ ml: 1, bgcolor: "primary.main", color: "#fff", height: 20, fontWeight: 700, fontSize: 10 }}
                            />
                          )}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 18 }}>{u.maxScore}</Typography>
                        <Typography variant="caption" color="text.secondary">smiles</Typography>
                      </Box>
                    </Stack>
                  );
                })
              )}
            </Box>

            {isAuthenticated && me && myRank >= 0 && (
              <Box
                sx={{
                  position: "sticky",
                  bottom: 16,
                  mt: 3,
                  mx: "auto",
                  maxWidth: 720,
                  p: 2,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #1A1530 0%, #2D2350 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  boxShadow: "0 18px 40px rgba(26, 21, 48, 0.25)",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    background: "linear-gradient(135deg, #FF5F8F, #7C5CFF)",
                    fontWeight: 800,
                  }}
                >
                  #{myRank + 1}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>You're at #{myRank + 1}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.75 }}>
                    {me.maxScore} smiles · keep grinning
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate("/smile")}
                  sx={{ flexShrink: 0 }}
                >
                  Climb
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </AppShell>
  );
};

export default LeaderboardPage;
