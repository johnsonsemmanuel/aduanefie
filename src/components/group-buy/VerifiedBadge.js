import React from "react";
import { Chip, Tooltip } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

/**
 * Shown only when the API says the organiser is verified. The backend requires
 * both an approved Ghana Card reference and enough completed external orders,
 * so the UI never infers trust from a local flag.
 */
const VerifiedBadge = ({ trust, size = "small" }) => {
  const verified =
    typeof trust === "string"
      ? trust === "verified_organizer"
      : Boolean(trust?.verified);
  if (!verified) return null;

  const label =
    typeof trust === "string"
      ? "Verified Organiser"
      : trust.badge_label || "Verified Organiser";

  return (
    <Tooltip title="Ghana Card reviewed and 2 or more completed external orders">
      <Chip
        size={size}
        color="success"
        variant="outlined"
        icon={<VerifiedIcon />}
        label={label}
      />
    </Tooltip>
  );
};

export default VerifiedBadge;
