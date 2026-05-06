import React, { useState } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VideocamIcon from "@mui/icons-material/Videocam";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import StopCircleIcon from "@mui/icons-material/StopCircle";

const DEFAULT_STEPS = [
  {
    icon: <VideocamIcon />,
    title: "Say yes to the camera",
    body: "smileplz needs your webcam to detect smiles. Nothing leaves your device — detection runs entirely in your browser.",
  },
  {
    icon: <SentimentVerySatisfiedIcon />,
    title: "Smile big, score points",
    body: "Watch the strength meter — you need to cross 70% to count. Quick consecutive smiles build a streak with score multipliers up to ×4.",
  },
  {
    icon: <StopCircleIcon />,
    title: "End to lock in your score",
    body: "Tap the End session button to save your run. We'll show you the damage on your dashboard.",
  },
];

const CoachMarks = ({ storageKey, steps = DEFAULT_STEPS }) => {
  const [step, setStep] = useState(() =>
    storageKey && localStorage.getItem(storageKey) ? -1 : 0
  );

  const close = () => {
    if (storageKey) localStorage.setItem(storageKey, "1");
    setStep(-1);
  };

  if (step < 0 || !steps[step]) return null;

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1500,
        display: "grid",
        placeItems: "center",
        backgroundColor: "rgba(26, 21, 48, 0.55)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 240ms ease",
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        className="pop-in"
        sx={{
          width: "calc(100% - 32px)",
          maxWidth: 440,
          borderRadius: 5,
          bgcolor: "background.paper",
          boxShadow: "0 24px 60px rgba(26, 21, 48, 0.35)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #FF5F8F 0%, #7C5CFF 100%)",
            p: 3,
            color: "#fff",
            position: "relative",
          }}
        >
          <IconButton
            size="small"
            onClick={close}
            aria-label="Skip tutorial"
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff", opacity: 0.85 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(255,255,255,0.18)",
              mb: 2,
              "& svg": { fontSize: 30 },
            }}
          >
            {current.icon}
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.85, fontWeight: 700, letterSpacing: 1 }}>
            STEP {step + 1} OF {steps.length}
          </Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>
            {current.title}
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
            {current.body}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            {steps.map((_, i) => (
              <Box
                key={i}
                sx={{
                  height: 6,
                  flexGrow: i === step ? 2 : 1,
                  borderRadius: 999,
                  bgcolor: i <= step ? "primary.main" : "rgba(26, 21, 48, 0.10)",
                  transition: "all 320ms ease",
                }}
              />
            ))}
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Button
              size="small"
              onClick={close}
              sx={{ color: "text.secondary" }}
            >
              Skip
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (isLast ? close() : setStep((s) => s + 1))}
            >
              {isLast ? "Got it — let's smile" : "Next"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CoachMarks;
