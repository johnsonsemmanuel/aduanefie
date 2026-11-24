import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled UI error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/home";
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#FAF8F5",
            px: 2,
          }}
        >
          <Box
            sx={{
              maxWidth: 440,
              width: "100%",
              p: 3.5,
              borderRadius: "16px",
              bgcolor: "#FFFFFF",
              border: "1px solid #E0D6BD",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#67513A", mb: 1 }}>
              Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B5B47", mb: 2.5 }}>
              An unexpected display issue occurred. You can reload the page or return to the marketplace home.
            </Typography>
            <Stack direction="row" spacing={1.5} justifyContent="center">
              <Button
                variant="contained"
                onClick={this.handleReload}
                sx={{ bgcolor: "#67513A", "&:hover": { bgcolor: "#55422F" }, textTransform: "none" }}
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                onClick={this.handleGoHome}
                sx={{ borderColor: "#67513A", color: "#67513A", textTransform: "none" }}
              >
                Go to Home
              </Button>
            </Stack>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
