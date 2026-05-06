import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ maxWidth: 480, textAlign: "center" }}>
          <Typography variant="h2" sx={{ fontSize: 64 }}>😟</Typography>
          <Typography variant="h4">That wasn't a smile.</Typography>
          <Typography color="text.secondary">
            Something broke on our end. Try going home and starting fresh.
          </Typography>
          <Button variant="contained" size="large" onClick={this.handleReset}>
            Take me home
          </Button>
        </Stack>
      </Box>
    );
  }
}

export default ErrorBoundary;
