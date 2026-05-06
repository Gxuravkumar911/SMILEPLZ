import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import SmileIcon from "@mui/icons-material/SentimentVerySatisfied";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Tooltip from "@mui/material/Tooltip";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

const navItems = [
  { to: "/smile", label: "Play", icon: <SmileIcon fontSize="small" /> },
  { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
  { to: "/leaderboard", label: "Leaderboard", icon: <LeaderboardIcon fontSize="small" /> },
];

const NavButton = ({ to, children, icon }) => (
  <Button
    component={NavLink}
    to={to}
    startIcon={icon}
    sx={{
      color: "text.secondary",
      px: 2,
      "&.active": {
        color: "text.primary",
        backgroundColor: "rgba(255, 95, 143, 0.10)",
      },
      "&:hover": { backgroundColor: "rgba(26, 21, 48, 0.04)" },
    }}
  >
    {children}
  </Button>
);

const Navbar = () => {
  const { username, isAuthenticated, logout } = useAuth();
  const { soundEnabled, toggleSound } = useSettings();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchor, setAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initial = (username || "?").charAt(0).toUpperCase();

  const handleLogout = () => {
    setAnchor(null);
    logout();
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        backdropFilter: "blur(14px)",
        backgroundColor: "rgba(255, 246, 240, 0.72)",
        borderBottom: "1px solid rgba(26, 21, 48, 0.06)",
        zIndex: (t) => t.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ maxWidth: 1280, width: "100%", mx: "auto", py: 1.25 }}>
        <Box component={Link} to={isAuthenticated ? "/smile" : "/"} sx={{ textDecoration: "none" }}>
          <Logo size={36} />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {!isMobile && isAuthenticated && (
          <Stack direction="row" spacing={0.5} sx={{ mr: 2 }}>
            {navItems.map((it) => (
              <NavButton key={it.to} to={it.to} icon={it.icon}>
                {it.label}
              </NavButton>
            ))}
          </Stack>
        )}

        <Tooltip title={soundEnabled ? "Mute sounds" : "Unmute sounds"}>
          <IconButton
            onClick={toggleSound}
            aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
            sx={{ mr: 1, color: soundEnabled ? "text.primary" : "text.secondary" }}
          >
            {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
        </Tooltip>

        {isAuthenticated ? (
          <>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  background: "linear-gradient(135deg, #FF8AB0, #7C5CFF)",
                  fontWeight: 800,
                  fontSize: 16,
                }}
              >
                {initial}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: { sx: { mt: 1, minWidth: 200, borderRadius: 3, p: 0.5 } },
              }}
            >
              <Box sx={{ px: 2, py: 1.25 }}>
                <Typography variant="caption" color="text.secondary">Signed in as</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{username}</Typography>
              </Box>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, gap: 1.5 }}>
                <LogoutIcon fontSize="small" /> Log out
              </MenuItem>
            </Menu>

            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ ml: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
          </>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button component={Link} to="/auth" variant="text" sx={{ color: "text.primary" }}>
              Log in
            </Button>
            <Button component={Link} to="/auth?mode=signup" variant="contained" color="primary">
              Get started
            </Button>
          </Stack>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Logo size={32} />
          <List sx={{ mt: 2 }}>
            {navItems.map((it) => (
              <ListItemButton
                key={it.to}
                component={NavLink}
                to={it.to}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  "&.active": { backgroundColor: "rgba(255, 95, 143, 0.10)" },
                }}
              >
                <Box sx={{ mr: 1.5, color: "text.secondary" }}>{it.icon}</Box>
                <ListItemText primary={it.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
