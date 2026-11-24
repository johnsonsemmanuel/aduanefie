import { alpha, Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

/**
 * Order status badge - pill shape with color variants.
 * Dark mode supported via theme palette.
 *
 * Props:
 *  - status: string  - order status (case-insensitive)
 *  - label: string   - custom label override
 *  - sx: object      - additional MUI sx overrides
 */

const useStatusConfig = (key) => {
  const theme = useTheme();
  const p = theme.palette;
  const isDark = theme.palette.mode === "dark";

  // High-contrast brand-aligned pill styles (no washed-out papayawhip / unreadable tints).
  const successStyle = {
    bg: isDark ? alpha(p.primary?.main ?? "#8B9F69", 0.25) : p.primary?.main ?? "#8B9F69",
    color: "#FFFFFF",
  };

  const brandEarthStyle = {
    bg: isDark ? alpha(p.primary?.deep ?? "#67513A", 0.35) : p.primary?.deep ?? "#67513A",
    color: "#FFFFFF",
  };

  const warningStyle = {
    bg: isDark ? alpha(p.warning?.secondary ?? "#bf6a02", 0.3) : p.warning?.secondary ?? "#bf6a02",
    color: "#FFFFFF",
  };

  const dangerStyle = {
    bg: isDark ? alpha(p.error?.danger ?? "#ec221f", 0.3) : p.error?.danger ?? "#ec221f",
    color: "#FFFFFF",
  };

  const neutralSandStyle = {
    bg: isDark ? alpha(p.background?.secondary ?? "#EFE7D3", 0.18) : p.background?.secondary ?? "#EFE7D3",
    color: isDark ? "#FAF8F5" : p.primary?.deep ?? "#67513A",
  };

  const map = {
    pending: brandEarthStyle,
    accepted: successStyle,
    booked: successStyle,
    processing: warningStyle,
    "on the way": warningStyle,
    delivered: successStyle,
    cancelled: dangerStyle,
    refunded: neutralSandStyle,
    confirmed: successStyle,
    failed: dangerStyle,
    canceled: dangerStyle,
    refund_requested: warningStyle,
    returned: neutralSandStyle,
    handover: warningStyle,
    picked_up: warningStyle,
    ongoing: brandEarthStyle,
    completed: successStyle,
    paid: successStyle,
    unpaid: dangerStyle,
    partially_paid: warningStyle,
    expired: dangerStyle,
  };

  return map[key] ?? brandEarthStyle;
};

const StatusBadge = ({ status = "pending", label, sx = {} }) => {
  const { t } = useTranslation();
  const key = (status ?? "").toLowerCase().trim();
  const config = useStatusConfig(key);
  const displayLabel = label ?? status ?? "";

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "20px",
        px: "8px",
        py: "2px",
        borderRadius: "9999px",
        backgroundColor: config.bg,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 400,
          color: config.color,
          lineHeight: 1.2,
          letterSpacing: "-0.36px",
          whiteSpace: "nowrap",
          textTransform: "none",
        }}
      >
        {t(displayLabel)}
      </Typography>
    </Box>
  );
};

export default StatusBadge;
