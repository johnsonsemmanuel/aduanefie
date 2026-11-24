import React, { useEffect, useState } from "react";
import { Fab, Zoom, useTheme } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useTranslation } from "react-i18next";

const ScrollToTopFab = ({ hasBottomNav = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setVisible(window.scrollY > 480);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={visible}>
      <Fab
        size="small"
        aria-label={t("Scroll to top")}
        onClick={handleClick}
        sx={{
          position: "fixed",
          left: { xs: 16, md: 24 },
          bottom: {
            xs: hasBottomNav ? 86 : 24,
            md: 28,
          },
          zIndex: 1082,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.primary.main,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 6px 18px rgba(0,0,0,0.14)",
          "&:hover": {
            bgcolor: theme.palette.primary.main,
            color: "#FFFFFF",
          },
        }}
      >
        <KeyboardArrowUpRoundedIcon />
      </Fab>
    </Zoom>
  );
};

export default React.memo(ScrollToTopFab);
