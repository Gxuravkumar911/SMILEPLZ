import React from "react";
import { Box, Typography } from "@mui/material";

const SmileMark = ({ size = 36 }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #FF8AB0 0%, #FF5F8F 60%, #7C5CFF 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 6px 16px rgba(255, 95, 143, 0.4)",
      flexShrink: 0,
    }}
  >
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <circle cx="8.5" cy="9.5" r="1.6" fill="#fff" />
      <circle cx="15.5" cy="9.5" r="1.6" fill="#fff" />
      <path
        d="M6.5 14.5c1.6 2.4 3.6 3.6 5.5 3.6s3.9-1.2 5.5-3.6"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </Box>
);

const Logo = ({ size = 36, withText = true, color }) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
    <SmileMark size={size} />
    {withText && (
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Fraunces", Georgia, serif',
          fontWeight: 800,
          fontSize: size * 0.55,
          letterSpacing: "-0.02em",
          color: color || "text.primary",
          lineHeight: 1,
        }}
      >
        smileplz
        <Box component="span" sx={{ color: "primary.main", ml: 0.25 }}>.</Box>
      </Typography>
    )}
  </Box>
);

export default Logo;
export { SmileMark };
