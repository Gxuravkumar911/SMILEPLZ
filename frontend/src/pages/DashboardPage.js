import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import IosShareIcon from "@mui/icons-material/IosShare";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { userApi } from "../api/client";
import { useToast } from "../components/Toast";
import { avatarGradient, initialOf } from "../utils/avatar";

const Stat = ({ label, value, gradient, icon, footer }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 5,
      background: gradient,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      minHeight: 160,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 18px 36px rgba(26, 21, 48, 0.10)",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1.25}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.22)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, opacity: 0.9 }}>
        {label}
      </Typography>
    </Stack>
    <Box>
      <Typography
        sx={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          mt: 1,
        }}
      >
        {value}
      </Typography>
      {footer && <Typography variant="caption" sx={{ opacity: 0.8, mt: 0.5, display: "block" }}>{footer}</Typography>}
    </Box>
    <Box
      sx={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
      }}
    />
  </Box>
);

const Badge = ({ unlocked, emoji, name, desc }) => (
  <Tooltip title={unlocked ? `Unlocked: ${desc}` : `Locked — ${desc}`}>
    <Stack
      alignItems="center"
      spacing={0.5}
      sx={{
        p: 1.5,
        borderRadius: 3,
        bgcolor: unlocked ? "rgba(255, 95, 143, 0.10)" : "rgba(26, 21, 48, 0.04)",
        border: unlocked ? "1px solid rgba(255, 95, 143, 0.25)" : "1px solid transparent",
        opacity: unlocked ? 1 : 0.5,
        filter: unlocked ? "none" : "grayscale(0.8)",
        minWidth: 96,
      }}
    >
      <Box sx={{ fontSize: 32 }}>{emoji}</Box>
      <Typography variant="caption" sx={{ fontWeight: 700 }}>{name}</Typography>
    </Stack>
  </Tooltip>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = useAuth();
  const toast = useToast();

  const seeded = location.state?.user;
  const justFinished = location.state?.justFinished;

  const [user, setUser] = useState(seeded || null);
  const [loading, setLoading] = useState(!seeded);
  const [rank, setRank] = useState(null);
  const [topThree, setTopThree] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!seeded) {
          const res = await userApi.getMaxScore(username);
          if (!mounted) return;
          const max = res.data?.maxScore ?? 0;
          setUser({
            username,
            score: 0,
            maxScore: max,
            earnings: max * 0.001,
          });
        }
        const lb = await userApi.leaderboard();
        if (!mounted) return;
        const list = lb.data || [];
        const idx = list.findIndex((u) => u.username === username);
        setRank(idx >= 0 ? idx + 1 : null);
        setTopThree(list.slice(0, 3));
      } catch (err) {
        toast.error("Couldn't load your stats. Try refreshing.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [username, seeded, toast]);

  const handleShare = async () => {
    const text = `I just hit ${user?.maxScore ?? 0} smiles on smileplz. Beat that. ✨`;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "smileplz" });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Score copied — go flex.");
      }
    } catch {
      // user dismissed share — ignore
    }
  };

  const score = user?.score ?? 0;
  const max = user?.maxScore ?? 0;
  const earnings = user?.earnings ?? max * 0.001;

  const badges = [
    { id: "first", emoji: "🌱", name: "First grin", desc: "Score at least once", unlocked: max >= 1 },
    { id: "ten", emoji: "✨", name: "Warm-up", desc: "Reach 10", unlocked: max >= 10 },
    { id: "fifty", emoji: "🔥", name: "On fire", desc: "Reach 50", unlocked: max >= 50 },
    { id: "hundred", emoji: "💎", name: "Centurion", desc: "Reach 100", unlocked: max >= 100 },
    { id: "rank10", emoji: "🏆", name: "Top 10", desc: "Reach the leaderboard", unlocked: rank !== null && rank <= 10 },
  ];

  if (loading) {
    return (
      <AppShell>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, mb: 0.5 }}>
              Hey, {username} 👋
            </Typography>
            <Typography color="text.secondary">
              Here's your smile report card.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleShare} startIcon={<IosShareIcon />} sx={{
              borderColor: "rgba(26, 21, 48, 0.16)",
              color: "text.primary",
              "&:hover": { borderColor: "text.primary", bgcolor: "rgba(26, 21, 48, 0.04)" },
            }}>
              Share
            </Button>
            <Button variant="contained" color="primary" startIcon={<PlayCircleIcon />} onClick={() => navigate("/smile")}>
              New session
            </Button>
          </Stack>
        </Stack>

        {justFinished && (
          <Box
            className="pop-in"
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 5,
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(124, 92, 255, 0.12))",
              border: "1px solid rgba(34, 197, 94, 0.25)",
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ fontWeight: 700, color: "success.dark", letterSpacing: 1 }}>
                Session complete
              </Typography>
              <Typography variant="h5" sx={{ mt: 0.5 }}>
                You scored {justFinished.score} {justFinished.score === 1 ? "smile" : "smiles"}
                {justFinished.score >= max && justFinished.score > 0 && (
                  <Box component="span" sx={{ color: "primary.main", ml: 1 }}>— new PB!</Box>
                )}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Best streak: {justFinished.streak} · Duration: {Math.floor(justFinished.durationSec / 60)}:{String(justFinished.durationSec % 60).padStart(2, "0")}
              </Typography>
            </Box>
            <Button variant="contained" color="success" onClick={() => navigate("/smile")}>
              Go again
            </Button>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            mb: 4,
          }}
        >
          <Stat
            label="Last session"
            value={score}
            footer="Smiles in your last run"
            icon={<SentimentVerySatisfiedIcon />}
            gradient="linear-gradient(135deg, #FF5F8F 0%, #FF8AB0 100%)"
          />
          <Stat
            label="Personal best"
            value={max}
            footer={max > 0 ? "Keep climbing." : "Start a session to set one."}
            icon={<EmojiEventsIcon />}
            gradient="linear-gradient(135deg, #7C5CFF 0%, #A289FF 100%)"
          />
          <Stat
            label="SmileCoins"
            value={earnings.toFixed(2)}
            footer="Virtual currency. Vanity. Power."
            icon={<TrendingUpIcon />}
            gradient="linear-gradient(135deg, #FFB627 0%, #FFCB5C 100%)"
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 5,
              bgcolor: "background.paper",
              border: "1px solid rgba(26, 21, 48, 0.06)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <StarIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6">Badges</Typography>
              <Chip
                size="small"
                label={`${badges.filter((b) => b.unlocked).length}/${badges.length}`}
                sx={{ bgcolor: "rgba(255, 95, 143, 0.10)", color: "primary.dark", fontWeight: 700 }}
              />
            </Stack>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ rowGap: 1.5 }}>
              {badges.map((b) => <Badge key={b.id} {...b} />)}
            </Stack>
          </Box>

          <Box
            sx={{
              p: 3,
              borderRadius: 5,
              bgcolor: "background.paper",
              border: "1px solid rgba(26, 21, 48, 0.06)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <LocalFireDepartmentIcon sx={{ color: "warning.main" }} />
              <Typography variant="h6">Your rank</Typography>
            </Stack>
            {rank ? (
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Fraunces", Georgia, serif',
                    fontSize: 64,
                    fontWeight: 800,
                    lineHeight: 1,
                    background: "linear-gradient(120deg, #FF5F8F, #7C5CFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  #{rank}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  out of the global leaderboard.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography color="text.secondary">
                  You haven't cracked the top 10 yet — but the door's wide open.
                </Typography>
              </Box>
            )}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LeaderboardIcon />}
              onClick={() => navigate("/leaderboard")}
              sx={{
                mt: 2.5,
                borderColor: "rgba(26, 21, 48, 0.16)",
                color: "text.primary",
                "&:hover": { borderColor: "text.primary", bgcolor: "rgba(26, 21, 48, 0.04)" },
              }}
            >
              See full leaderboard
            </Button>
          </Box>
        </Box>

        {topThree.length > 0 && (
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 5,
              bgcolor: "background.paper",
              border: "1px solid rgba(26, 21, 48, 0.06)",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <EmojiEventsIcon sx={{ color: "warning.main" }} />
                <Typography variant="h6">Top of the leaderboard</Typography>
              </Stack>
              <Button
                size="small"
                onClick={() => navigate("/leaderboard")}
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                View all →
              </Button>
            </Stack>

            {(() => {
              const u = topThree[0];
              const isMe = u.username === username;
              return (
                <Box
                  sx={{
                    position: "relative",
                    p: { xs: 2, md: 2.5 },
                    borderRadius: 4,
                    mb: 1.25,
                    background: isMe
                      ? "linear-gradient(135deg, #FF5F8F 0%, #7C5CFF 100%)"
                      : "linear-gradient(135deg, #FFE9A8 0%, #FFD27A 50%, #F2A65A 100%)",
                    color: isMe ? "#fff" : "#3D2A0E",
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                    overflow: "hidden",
                    boxShadow: isMe
                      ? "0 16px 32px rgba(255, 95, 143, 0.32)"
                      : "0 12px 28px rgba(242, 166, 90, 0.30)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -16,
                      right: -16,
                      fontSize: 120,
                      opacity: 0.16,
                      pointerEvents: "none",
                      transform: "rotate(8deg)",
                    }}
                  >
                    👑
                  </Box>

                  <Box sx={{ position: "relative", flexShrink: 0 }}>
                    <Avatar
                      sx={{
                        width: { xs: 52, md: 60 },
                        height: { xs: 52, md: 60 },
                        background: avatarGradient(u.username),
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: { xs: 22, md: 26 },
                        border: "3px solid rgba(255,255,255,0.55)",
                      }}
                    >
                      {initialOf(u.username)}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        top: -14,
                        left: -10,
                        fontSize: 26,
                        transform: "rotate(-22deg)",
                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
                      }}
                    >
                      👑
                    </Box>
                  </Box>

                  <Box sx={{ flexGrow: 1, minWidth: 0, position: "relative" }}>
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.5 }}>
                      <Chip
                        size="small"
                        label="#1 Champion"
                        sx={{
                          bgcolor: isMe ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.16)",
                          color: "inherit",
                          fontWeight: 700,
                          height: 22,
                          fontSize: 11,
                          letterSpacing: 0.3,
                        }}
                      />
                      {isMe && (
                        <Chip
                          size="small"
                          label="that's you"
                          sx={{
                            bgcolor: "rgba(255,255,255,0.4)",
                            color: "inherit",
                            fontWeight: 700,
                            height: 22,
                            fontSize: 11,
                          }}
                        />
                      )}
                    </Stack>
                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", Georgia, serif',
                        fontWeight: 800,
                        fontSize: { xs: 22, md: 26 },
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {u.username}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right", flexShrink: 0, position: "relative" }}>
                    <Typography
                      sx={{
                        fontFamily: '"Fraunces", Georgia, serif',
                        fontWeight: 800,
                        fontSize: { xs: 32, md: 40 },
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {u.maxScore}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ opacity: 0.85, fontWeight: 700, letterSpacing: 0.5 }}
                    >
                      smiles
                    </Typography>
                  </Box>
                </Box>
              );
            })()}

            <Stack spacing={0.75}>
              {topThree.slice(1).map((u, idx) => {
                const place = idx + 2;
                const isMe = u.username === username;
                const medal = place === 2 ? "🥈" : "🥉";
                return (
                  <Stack
                    key={u.username}
                    direction="row"
                    alignItems="center"
                    spacing={1.75}
                    sx={{
                      p: 1.25,
                      pl: 1.5,
                      borderRadius: 3,
                      bgcolor: isMe ? "rgba(255, 95, 143, 0.08)" : "rgba(26, 21, 48, 0.025)",
                      border: isMe
                        ? "1px solid rgba(255, 95, 143, 0.22)"
                        : "1px solid transparent",
                      transition: "all 180ms ease",
                      "&:hover": {
                        bgcolor: isMe ? "rgba(255, 95, 143, 0.12)" : "rgba(26, 21, 48, 0.05)",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 22,
                        minWidth: 32,
                        textAlign: "center",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                      }}
                    >
                      {medal}
                    </Box>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        background: avatarGradient(u.username),
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {initialOf(u.username)}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.username}
                        {isMe && (
                          <Box
                            component="span"
                            sx={{ ml: 1, color: "primary.main", fontWeight: 700, fontSize: 12 }}
                          >
                            (you)
                          </Box>
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        #{place}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>
                        {u.maxScore}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        smiles
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>
    </AppShell>
  );
};

export default DashboardPage;
