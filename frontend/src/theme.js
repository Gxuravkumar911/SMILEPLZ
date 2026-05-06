import { createTheme } from "@mui/material/styles";

const palette = {
  primary: { main: "#FF5F8F", light: "#FF8AB0", dark: "#D43E6E", contrastText: "#FFFFFF" },
  secondary: { main: "#7C5CFF", light: "#A289FF", dark: "#5A3FE0", contrastText: "#FFFFFF" },
  success: { main: "#22C55E", light: "#4ADE80", dark: "#15803D", contrastText: "#FFFFFF" },
  warning: { main: "#FFB627", light: "#FFCB5C", dark: "#D48E10", contrastText: "#1A1530" },
  info: { main: "#06B6D4", light: "#22D3EE", dark: "#0E7490", contrastText: "#FFFFFF" },
  error: { main: "#EF4444", light: "#F87171", dark: "#B91C1C", contrastText: "#FFFFFF" },
  background: { default: "#FFF6F0", paper: "#FFFFFF" },
  text: { primary: "#1A1530", secondary: "#5B5470", disabled: "#A6A0B8" },
  divider: "rgba(26, 21, 48, 0.08)",
};

const theme = createTheme({
  palette,
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 },
    h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 },
    h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 },
    h4: { fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontWeight: 700, letterSpacing: "-0.005em" },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none", letterSpacing: "0.01em" },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
  },
  shadows: [
    "none",
    "0 1px 2px rgba(26, 21, 48, 0.04)",
    "0 2px 6px rgba(26, 21, 48, 0.06)",
    "0 4px 12px rgba(26, 21, 48, 0.08)",
    "0 6px 18px rgba(26, 21, 48, 0.08)",
    "0 8px 24px rgba(26, 21, 48, 0.10)",
    "0 12px 32px rgba(26, 21, 48, 0.12)",
    "0 16px 40px rgba(26, 21, 48, 0.14)",
    "0 20px 48px rgba(26, 21, 48, 0.16)",
    ...Array(16).fill("0 24px 56px rgba(26, 21, 48, 0.18)"),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: palette.background.default,
          backgroundImage:
            "radial-gradient(at 12% 8%, rgba(255, 95, 143, 0.18) 0px, transparent 45%), " +
            "radial-gradient(at 88% 12%, rgba(124, 92, 255, 0.16) 0px, transparent 45%), " +
            "radial-gradient(at 50% 95%, rgba(255, 182, 39, 0.14) 0px, transparent 45%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "::selection": { background: "rgba(255, 95, 143, 0.3)" },
        "*::-webkit-scrollbar": { width: 10, height: 10 },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(26, 21, 48, 0.18)",
          borderRadius: 8,
        },
        "*::-webkit-scrollbar-thumb:hover": { background: "rgba(26, 21, 48, 0.32)" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 22,
          paddingBlock: 10,
          fontWeight: 700,
        },
        sizeLarge: { paddingInline: 28, paddingBlock: 14, fontSize: "1rem" },
        containedPrimary: {
          boxShadow: "0 8px 20px rgba(255, 95, 143, 0.32)",
          "&:hover": { boxShadow: "0 12px 26px rgba(255, 95, 143, 0.42)" },
        },
        containedSecondary: {
          boxShadow: "0 8px 20px rgba(124, 92, 255, 0.32)",
          "&:hover": { boxShadow: "0 12px 26px rgba(124, 92, 255, 0.42)" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: 24 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: "1px solid rgba(26, 21, 48, 0.06)",
          boxShadow: "0 4px 20px rgba(26, 21, 48, 0.04)",
          transition: "transform 200ms ease, box-shadow 200ms ease",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "& fieldset": { borderColor: "rgba(26, 21, 48, 0.12)" },
          "&:hover fieldset": { borderColor: "rgba(255, 95, 143, 0.5)" },
          "&.Mui-focused fieldset": { borderWidth: 2 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 999, fontWeight: 600 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "transparent" },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(26, 21, 48, 0.92)",
          fontSize: "0.78rem",
          padding: "6px 10px",
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
