import React, { useEffect, useState } from "react";
import { Box, Button, Slide, Stack, Typography } from "@mui/material";
import WifiOffRoundedIcon from "@mui/icons-material/WifiOffRounded";
import WifiRoundedIcon from "@mui/icons-material/WifiRounded";
import { useTranslation } from "react-i18next";

const NetworkStatusBanner = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState("online"); // "online" | "offline" | "reconnected"

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!navigator.onLine) {
      setStatus("offline");
    }

    let timer;
    const handleOffline = () => {
      clearTimeout(timer);
      setStatus("offline");
    };
    const handleOnline = () => {
      setStatus("reconnected");
      clearTimeout(timer);
      timer = setTimeout(() => setStatus("online"), 3200);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const visible = status === "offline" || status === "reconnected";
  const isOffline = status === "offline";

  return (
    <Slide direction="down" in={visible} mountOnEnter unmountOnExit>
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          px: 2,
          py: 0.9,
          bgcolor: isOffline ? "#9A3412" : "#2D6A4F",
          color: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.25}
          flexWrap="wrap"
        >
          {isOffline ? (
            <WifiOffRoundedIcon sx={{ fontSize: 18 }} />
          ) : (
            <WifiRoundedIcon sx={{ fontSize: 18 }} />
          )}
          <Typography fontSize="13px" fontWeight={600} color="#FFFFFF">
            {isOffline
              ? t("You are offline. Check your connection to continue.")
              : t("Back online. Connection restored.")}
          </Typography>
          {isOffline && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                color: "#FFFFFF",
                borderColor: "rgba(255,255,255,0.55)",
                fontSize: "12px",
                py: 0.2,
                px: 1.25,
                minHeight: "26px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#FFFFFF",
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              {t("Retry")}
            </Button>
          )}
        </Stack>
      </Box>
    </Slide>
  );
};

export default React.memo(NetworkStatusBanner);
