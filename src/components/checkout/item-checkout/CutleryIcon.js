import React from "react";
import { useTheme } from "@mui/material";

// Legacy component name kept for compatibility. The marketplace is produce-
// first, so the glyph is a produce/packaging icon rather than cutlery.
const CutleryIcon = () => {
  const theme = useTheme();
  return (
    <i
      className="fi fi-rr-box-open"
      aria-hidden
      style={{
        display: "flex",
        fontSize: "18px",
        lineHeight: 1,
        color: theme.palette.primary.main,
      }}
    />
  );
};

export default CutleryIcon;
