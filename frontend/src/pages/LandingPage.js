import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
  AvatarGroup,
} from "@mui/material";
import { Link } from "react-router-dom";
import VideocamIcon from "@mui/icons-material/Videocam";
import BoltIcon from "@mui/icons-material/Bolt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AppShell from "../components/AppShell";
import { SmileMark } from "../components/Logo";

const Feature = ({ icon, title, body, color }) => (
  <Card
    sx={{
      p: 1,
      height: "100%",
      transition: "transform 280ms ease, box-shadow 280ms ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 18px 36px rgba(26, 21, 48, 0.10)",
      },
    }}
  >
    <CardContent>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          background: color,
          color: "#fff",
          mb: 2,
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ mb: 0.75 }}>{title}</Typography>
      <Typography color="text.secondary">{body}</Typography>
    </CardContent>
  </Card>
);

const Step = ({ n, title, body }) => (
  <Stack direction="row" spacing={2.5} alignItems="flex-start">
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        flexShrink: 0,
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #FF8AB0, #7C5CFF)",
        color: "#fff",
        fontWeight: 800,
        fontSize: 18,
      }}
    >
      {n}
    </Box>
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
      <Typography color="text.secondary">{body}</Typography>
    </Box>
  </Stack>
);

const LandingPage = () => {
  return (
    <AppShell>
      <Container maxWidth="lg" disableGutters>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 4, md: 6 },
            alignItems: "center",
            py: { xs: 2, md: 6 },
          }}
        >
          <Box>
            <Chip
              label="✨ Real-time smile detection"
              sx={{
                mb: 3,
                bgcolor: "rgba(124, 92, 255, 0.10)",
                color: "secondary.dark",
                fontWeight: 700,
                fontSize: 12,
              }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 44, sm: 56, md: 72 }, mb: 2 }}>
              Smile a little.
              <br />
              <Box component="span" sx={{
                background: "linear-gradient(120deg, #FF5F8F 0%, #7C5CFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Climb a lot.
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400, mb: 4, maxWidth: 520 }}
            >
              smileplz turns your grin into points. We detect smiles right in your browser —
              your camera never leaves your device — and rank you against the happiest humans on the internet.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 5 }}>
              <Button
                component={Link}
                to="/auth?mode=signup"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon />}
              >
                Start smiling — it's free
              </Button>
              <Button
                component={Link}
                to="/leaderboard"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "rgba(26, 21, 48, 0.16)",
                  color: "text.primary",
                  "&:hover": { borderColor: "text.primary", bgcolor: "rgba(26, 21, 48, 0.04)" },
                }}
              >
                See the leaderboard
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 32, height: 32, fontSize: 13, border: "2px solid white" } }}>
                <Avatar sx={{ background: "linear-gradient(135deg, #FF8AB0, #FF5F8F)" }}>A</Avatar>
                <Avatar sx={{ background: "linear-gradient(135deg, #7C5CFF, #5A3FE0)" }}>M</Avatar>
                <Avatar sx={{ background: "linear-gradient(135deg, #FFB627, #D48E10)" }}>K</Avatar>
                <Avatar sx={{ background: "linear-gradient(135deg, #22C55E, #15803D)" }}>R</Avatar>
              </AvatarGroup>
              <Typography variant="body2" color="text.secondary">
                Joining a happy crowd. No credit card. Just teeth.
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <Box
              className="float-slow"
              sx={{
                position: "relative",
                width: { xs: 280, sm: 360, md: 420 },
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: "conic-gradient(from 90deg, #FF5F8F, #FFB627, #7C5CFF, #22C55E, #FF5F8F)",
                p: "6px",
                boxShadow: "0 30px 80px rgba(255, 95, 143, 0.35)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FFFFFF 0%, #FFF6F0 100%)",
                  display: "grid",
                  placeItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ fontSize: { xs: 130, sm: 170, md: 200 }, lineHeight: 1, animation: "pulse-glow 2.4s infinite", borderRadius: "50%" }}>
                  😄
                </Box>

                {[
                  { top: "8%", left: "10%", emoji: "😊", delay: "0s" },
                  { top: "14%", right: "8%", emoji: "😁", delay: "0.6s" },
                  { bottom: "12%", left: "12%", emoji: "🤩", delay: "1.2s" },
                  { bottom: "18%", right: "10%", emoji: "🥳", delay: "1.8s" },
                ].map((e, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: "absolute",
                      ...e,
                      fontSize: { xs: 24, sm: 30 },
                      animation: `float-slow 5s ease-in-out infinite`,
                      animationDelay: e.delay,
                    }}
                  >
                    {e.emoji}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: { xs: 6, md: 10 } }}>
          <Typography variant="h3" align="center" sx={{ mb: 1.5, fontSize: { xs: 32, md: 44 } }}>
            Built for joy. Engineered for fun.
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ mb: 5, maxWidth: 560, mx: "auto" }}>
            Four reasons smileplz isn't just another web toy.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 3,
            }}
          >
            <Feature
              icon={<VideocamIcon />}
              title="On-device AI"
              body="Smile detection runs entirely in your browser. No video ever leaves your machine."
              color="linear-gradient(135deg, #FF8AB0, #FF5F8F)"
            />
            <Feature
              icon={<BoltIcon />}
              title="Instant feedback"
              body="Real-time strength meter shows exactly how big your grin needs to be."
              color="linear-gradient(135deg, #FFCB5C, #FFB627)"
            />
            <Feature
              icon={<EmojiEventsIcon />}
              title="Global leaderboard"
              body="Climb the ranks. Get a podium spot. Brag a little. We won't tell."
              color="linear-gradient(135deg, #A289FF, #7C5CFF)"
            />
            <Feature
              icon={<LockIcon />}
              title="Privacy-first"
              body="No video uploads, no face data stored. Just your score and your smile."
              color="linear-gradient(135deg, #4ADE80, #22C55E)"
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            p: { xs: 3, md: 6 },
            borderRadius: 6,
            background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.85) 100%)",
            border: "1px solid rgba(26, 21, 48, 0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography variant="h3" align="center" sx={{ mb: 5, fontSize: { xs: 30, md: 40 } }}>
            How it works
          </Typography>
          <Stack spacing={4} sx={{ maxWidth: 640, mx: "auto" }}>
            <Step n={1} title="Sign up in 5 seconds" body="No email confirmations, no marketing spam. Pick a name, pick a password, you're in." />
            <Step n={2} title="Allow your camera" body="Your browser asks once. You say yes. The model loads locally." />
            <Step n={3} title="Smile your face off" body="Each smile = +1 point. Bigger smiles count more. Streaks unlock multipliers." />
            <Step n={4} title="Climb the leaderboard" body="Top 10 gets a permanent podium spot. Your friends will hear about it." />
          </Stack>
        </Box>

        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            mb: 4,
            p: { xs: 4, md: 8 },
            borderRadius: 6,
            background: "linear-gradient(135deg, #FF5F8F 0%, #7C5CFF 100%)",
            color: "#fff",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "absolute", top: 20, left: 20, opacity: 0.2 }}>
            <SmileMark size={80} />
          </Box>
          <Box sx={{ position: "absolute", bottom: 20, right: 20, opacity: 0.2 }}>
            <SmileMark size={120} />
          </Box>

          <Typography variant="h2" sx={{ position: "relative", mb: 2, fontSize: { xs: 32, md: 48 } }}>
            Your face. Your fun. Your turn.
          </Typography>
          <Typography sx={{ position: "relative", mb: 4, opacity: 0.9, fontSize: 18 }}>
            Free forever. Takes one smile to start.
          </Typography>
          <Button
            component={Link}
            to="/auth?mode=signup"
            size="large"
            sx={{
              position: "relative",
              bgcolor: "#fff",
              color: "primary.main",
              fontWeight: 800,
              px: 4,
              py: 1.5,
              "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Get started — it's free
          </Button>
        </Box>
      </Container>
    </AppShell>
  );
};

export default LandingPage;
