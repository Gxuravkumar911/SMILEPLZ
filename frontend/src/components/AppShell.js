import React from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

const AppShell = ({ children, hideNav = false, fullBleed = false }) => (
  <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    {!hideNav && <Navbar />}
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: "100%",
        maxWidth: fullBleed ? "100%" : 1280,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      {children}
    </Box>
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        py: 3,
        color: "text.secondary",
        fontSize: 13,
        opacity: 0.7,
      }}
    >
      smileplz · made with grins
    </Box>
  </Box>
);

export default AppShell;
