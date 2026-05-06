import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  LinearProgress,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import SmileDetector from "../components/SmileDetector";
import CoachMarks from "../components/CoachMarks";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { userApi } from "../api/client";
import { feedbackSmile, feedbackPB, feedbackCombo } from "../utils/feedback";
import { fireConfetti, fireBurst } from "../utils/confetti";

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

const STREAK_WINDOW_MS = 1500;

const multiplierForStreak = (s) => {
  if (s >= 20) return 4;
  if (s >= 10) return 3;
  if (s >= 5) return 2;
  return 1;
};

const SmilePage = () => {
  const navigate = useNavigate();
  const { username } = useAuth();
  const toast = useToast();

  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [strength, setStrength] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [bursts, setBursts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const lastSmileAtRef = useRef(0);
  const startedAtRef = useRef(Date.now());
  const pbCelebratedRef = useRef(false);
  const lastMultiplierRef = useRef(1);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [maxRes, lbRes] = await Promise.allSettled([
          userApi.getMaxScore(username),
          userApi.leaderboard(),
        ]);
        if (!mounted) return;
        if (maxRes.status === "fulfilled") {
          setMaxScore(maxRes.value.data?.maxScore ?? 0);
        }
        if (lbRes.status === "fulfilled") {
          setLeaderboard(lbRes.value.data || []);
        }
      } catch {
        // non-critical
      }
    })();
    return () => { mounted = false; };
  }, [username]);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const spawnBurst = useCallback(() => {
    const id = Math.random().toString(36).slice(2);
    const emoji = ["✨", "💖", "🎉", "😄", "⭐"][Math.floor(Math.random() * 5)];
    const left = 30 + Math.random() * 40;
    setBursts((b) => [...b, { id, emoji, left }]);
    setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1400);
  }, []);

  const handleSmile = useCallback(() => {
    const now = performance.now();
    const cont = now - lastSmileAtRef.current < STREAK_WINDOW_MS;
    const newStreak = cont ? streak + 1 : 1;
    const multiplier = multiplierForStreak(newStreak);

    setScore((s) => {
      const ns = s + multiplier;
      localStorage.setItem("currentScore", String(ns));
      if (!pbCelebratedRef.current && maxScore > 0 && s <= maxScore && ns > maxScore) {
        pbCelebratedRef.current = true;
        feedbackPB();
        fireConfetti({ count: 130 });
      } else {
        feedbackSmile();
      }
      return ns;
    });

    setStreak(newStreak);
    setBestStreak((b) => Math.max(b, newStreak));

    if (multiplier > lastMultiplierRef.current) {
      feedbackCombo(multiplier);
      fireBurst({ count: 18, y: window.innerHeight * 0.5 });
    }
    lastMultiplierRef.current = multiplier;

    lastSmileAtRef.current = now;
    spawnBurst();
  }, [spawnBurst, streak, maxScore]);

  const handleStrength = useCallback((v) => {
    setStrength(v);
    if (performance.now() - lastSmileAtRef.current > STREAK_WINDOW_MS) {
      setStreak(0);
      lastMultiplierRef.current = 1;
    }
  }, []);

  const handleStop = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await userApi.updateScore(username, score);
      const user = res.data?.user;
      navigate("/dashboard", {
        state: {
          justFinished: { score, streak: bestStreak, durationSec: elapsed },
          user,
        },
      });
    } catch (err) {
      toast.error(`Couldn't save your score — ${err?.message || "try again"}`);
      setSubmitting(false);
    }
  };

  const beatsPB = score > maxScore;
  const strengthPct = Math.round(strength * 100);
  const isSmiling = strength >= 0.7;
  const multiplier = multiplierForStreak(streak);

  const { liveRank, nextTarget, gap } = useMemo(() => {
    const myEffective = Math.max(score, maxScore);
    const others = leaderboard.filter((u) => u.username !== username);
    const ahead = others
      .filter((u) => u.maxScore > myEffective)
      .sort((a, b) => a.maxScore - b.maxScore);
    return {
      liveRank: ahead.length + 1,
      nextTarget: ahead[0] || null,
      gap: ahead[0] ? ahead[0].maxScore - myEffective + 1 : 0,
    };
  }, [leaderboard, score, maxScore, username]);

  return (
    <AppShell>
      <CoachMarks storageKey="smileplz.coach.smile.v1" />

      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h3" sx={{ fontSize: { xs: 32, md: 44 }, mb: 0.5 }}>
              Smile session
            </Typography>
            <Typography color="text.secondary">
              Hi <strong>{username}</strong> — every grin's a point. Big ones count harder.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
            <Chip
              icon={<TimerIcon />}
              label={formatTime(elapsed)}
              sx={{ bgcolor: "background.paper", fontWeight: 700 }}
            />
            <Chip
              icon={<EmojiEventsIcon />}
              label={`PB ${maxScore}`}
              sx={{ bgcolor: "background.paper", fontWeight: 700 }}
            />
            {leaderboard.length > 0 && (
              <Chip
                icon={<TrendingUpIcon />}
                label={liveRank === 1 ? "🥇 #1 — defend it" : `#${liveRank}`}
                sx={{
                  bgcolor: liveRank === 1 ? "warning.main" : "background.paper",
                  color: liveRank === 1 ? "#1A1530" : "text.primary",
                  fontWeight: 700,
                }}
              />
            )}
          </Stack>
        </Stack>

        {nextTarget && leaderboard.length > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 1.75,
              px: 2.25,
              borderRadius: 999,
              background: "linear-gradient(90deg, rgba(255,95,143,0.08), rgba(124,92,255,0.08))",
              border: "1px solid rgba(124,92,255,0.18)",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ fontSize: 22, lineHeight: 1 }}>🎯</Box>
            <Typography sx={{ fontWeight: 700 }}>
              {gap} more to overtake{" "}
              <Box component="span" sx={{ color: "primary.main" }}>{nextTarget.username}</Box>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
              They're at {nextTarget.maxScore}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <SmileDetector
              onSmile={handleSmile}
              onStrength={handleStrength}
              paused={submitting}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            >
              {bursts.map((b) => (
                <Box
                  key={b.id}
                  sx={{
                    position: "absolute",
                    left: `${b.left}%`,
                    bottom: "12%",
                    fontSize: 28,
                    animation: "burstUp 1.4s ease-out forwards",
                    "@keyframes burstUp": {
                      "0%": { transform: "translateY(0) scale(0.6)", opacity: 0 },
                      "20%": { opacity: 1, transform: "translateY(-20px) scale(1.1)" },
                      "100%": { transform: "translateY(-220px) scale(0.9) rotate(15deg)", opacity: 0 },
                    },
                  }}
                >
                  {b.emoji}
                </Box>
              ))}
            </Box>

            {multiplier > 1 && (
              <Box
                key={multiplier}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  px: 1.75,
                  py: 0.75,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #FFB627, #FF5F8F)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                  boxShadow: "0 8px 22px rgba(255, 95, 143, 0.45)",
                  animation: "popIn 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  pointerEvents: "none",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.6)", opacity: 0 },
                    "60%": { transform: "scale(1.15)", opacity: 1 },
                    "100%": { transform: "scale(1)" },
                  },
                }}
              >
                ×{multiplier} COMBO 🔥
              </Box>
            )}
          </Box>

          <Stack spacing={2.5}>
            <Box
              sx={{
                p: 3,
                borderRadius: 5,
                background: beatsPB
                  ? "linear-gradient(135deg, #FF5F8F 0%, #7C5CFF 100%)"
                  : "linear-gradient(135deg, #FFFFFF 0%, #FFF6F0 100%)",
                color: beatsPB ? "#fff" : "text.primary",
                border: beatsPB ? "none" : "1px solid rgba(26, 21, 48, 0.06)",
                boxShadow: beatsPB
                  ? "0 18px 40px rgba(255, 95, 143, 0.35)"
                  : "0 6px 18px rgba(26, 21, 48, 0.06)",
                transition: "all 360ms ease",
              }}
            >
              <Typography
                variant="overline"
                sx={{ opacity: beatsPB ? 0.85 : 0.6, fontWeight: 700, letterSpacing: 1 }}
              >
                {beatsPB ? "🔥 New personal best!" : "Current score"}
              </Typography>
              <Box
                key={score}
                sx={{
                  fontSize: { xs: 64, md: 88 },
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontWeight: 800,
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  animation: "pop-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                {score}
              </Box>
              <Typography sx={{ opacity: beatsPB ? 0.9 : 0.6, mt: 0.5 }}>
                {beatsPB ? `Beating ${maxScore} — keep going!` : `Your record is ${maxScore}.`}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 5,
                bgcolor: "background.paper",
                border: "1px solid rgba(26, 21, 48, 0.06)",
                boxShadow: "0 6px 18px rgba(26, 21, 48, 0.06)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: "text.secondary" }}>
                  Smile strength
                </Typography>
                <Typography variant="caption" color={isSmiling ? "success.main" : "text.secondary"} sx={{ fontWeight: 700 }}>
                  {isSmiling ? "Counting!" : "Bigger! ☺"}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={strengthPct}
                sx={{
                  height: 14,
                  borderRadius: 999,
                  bgcolor: "rgba(26, 21, 48, 0.06)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 999,
                    background: isSmiling
                      ? "linear-gradient(90deg, #22C55E, #4ADE80)"
                      : "linear-gradient(90deg, #FF5F8F, #FFB627)",
                    transition: "transform 120ms linear",
                  },
                }}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="caption" color="text.secondary">{strengthPct}%</Typography>
                <Typography variant="caption" color="text.secondary">
                  Threshold: 70%
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 5,
                bgcolor: "background.paper",
                border: "1px solid rgba(26, 21, 48, 0.06)",
                boxShadow: "0 6px 18px rgba(26, 21, 48, 0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    background: streak > 0
                      ? "linear-gradient(135deg, #FFB627, #FF5F8F)"
                      : "rgba(26, 21, 48, 0.06)",
                    color: streak > 0 ? "#fff" : "text.secondary",
                    transition: "all 300ms ease",
                  }}
                >
                  <LocalFireDepartmentIcon />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      STREAK
                    </Typography>
                    {multiplier > 1 && (
                      <Chip
                        size="small"
                        label={`×${multiplier}`}
                        sx={{
                          height: 18,
                          fontSize: 11,
                          fontWeight: 800,
                          background: "linear-gradient(135deg, #FFB627, #FF5F8F)",
                          color: "#fff",
                        }}
                      />
                    )}
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {streak}
                  </Typography>
                </Box>
                <Tooltip title="Best streak this session">
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">Best</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{bestStreak}</Typography>
                  </Box>
                </Tooltip>
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "rgba(26, 21, 48, 0.06)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {[5, 10, 20].map((threshold, i) => {
                    const prev = [0, 5, 10][i];
                    const segWidth = ((threshold - prev) / 20) * 100;
                    const segLeft = (prev / 20) * 100;
                    const filled = streak >= threshold;
                    const partial = streak > prev && streak < threshold;
                    const partialWidth = partial ? ((streak - prev) / (threshold - prev)) * segWidth : 0;
                    return (
                      <React.Fragment key={threshold}>
                        {(filled || partial) && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: `${segLeft}%`,
                              height: "100%",
                              width: `${filled ? segWidth : partialWidth}%`,
                              background: ["linear-gradient(90deg,#FFCB5C,#FFB627)", "linear-gradient(90deg,#FFB627,#FF8AB0)", "linear-gradient(90deg,#FF8AB0,#7C5CFF)"][i],
                              transition: "width 220ms ease",
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.75 }}>
                  <Typography variant="caption" color="text.secondary">×1</Typography>
                  <Typography variant="caption" color={streak >= 5 ? "warning.main" : "text.secondary"} sx={{ fontWeight: streak >= 5 ? 700 : 400 }}>×2</Typography>
                  <Typography variant="caption" color={streak >= 10 ? "warning.main" : "text.secondary"} sx={{ fontWeight: streak >= 10 ? 700 : 400 }}>×3</Typography>
                  <Typography variant="caption" color={streak >= 20 ? "primary.main" : "text.secondary"} sx={{ fontWeight: streak >= 20 ? 700 : 400 }}>×4</Typography>
                </Stack>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleStop}
              disabled={submitting}
              startIcon={!submitting && <StopCircleIcon />}
              sx={{ py: 1.75, fontSize: 16 }}
            >
              {submitting ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "End session"}
            </Button>

            <Typography variant="caption" align="center" color="text.secondary">
              We'll save your score and take you to your dashboard.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </AppShell>
  );
};

export default SmilePage;
