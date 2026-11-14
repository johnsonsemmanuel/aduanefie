import React from "react";
import { Box, Chip, Stack, Tooltip, Typography, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BADGE_SRC = "/static/badges/trade-insurance-badge.svg";

const InsuranceBadge = ({ item, variant = "compact", sx = {} }) => {
  const { t } = useTranslation();
  const { configData } = useSelector((state) => state.configData);
  const ins = configData?.insurance_settings;

  const isEnabled = !!ins?.status;
  const showBadge = ins?.show_badge !== false;
  const itemInsured = !!item?.is_insured;

  if (!isEnabled || !itemInsured) return null;
  if (variant === "compact" && !showBadge) return null;

  const providerName = ins?.provider_name || t("Aduanefie Trade & Crop Assurance");
  const ratePct = ins?.rate_percent ?? 2.5;
  const summary =
    ins?.policy_summary ||
    t("Covers crop spoilage, cross-border transit loss, and order quality under Aduanefie Escrow.");

  if (variant === "compact") {
    return (
      <Tooltip title={`${providerName}: ${summary}`} arrow>
        <Chip
          size="small"
          icon={
            <Box
              component="img"
              src={BADGE_SRC}
              alt={t("Insured")}
              sx={{ width: 16, height: 16, ml: "4px !important" }}
            />
          }
          label={t("Insured")}
          sx={{
            height: 22,
            bgcolor: "#FFFBEB",
            color: "#92400E",
            border: "1px solid #F59E0B",
            fontWeight: 700,
            fontSize: "11px",
            borderRadius: "6px",
            "& .MuiChip-label": { px: "6px" },
            ...sx,
          }}
        />
      </Tooltip>
    );
  }

  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: "10px",
        border: "1px solid",
        borderColor: alpha("#D97706", 0.35),
        background: "linear-gradient(135deg, #FFFBEB 0%, #F0FDF4 100%)",
        ...sx,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          component="img"
          src={BADGE_SRC}
          alt={providerName}
          sx={{ width: 40, height: 40, flexShrink: 0, mt: 0.25 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={0.5}>
            <Typography sx={{ fontWeight: 700, fontSize: "13px", color: "#92400E" }}>
              {providerName}
            </Typography>
            <Chip
              size="small"
              label={t("{{rate}}% Coverage Fee", { rate: ratePct })}
              sx={{
                height: 20,
                fontSize: "10.5px",
                fontWeight: 700,
                bgcolor: alpha("#D97706", 0.14),
                color: "#92400E",
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: "12px", color: "#4B5563", mt: 0.4, lineHeight: 1.45 }}>
            {summary}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mt: 1 }}>
            {ins?.crop_spoilage !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#15803D" }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#166534" }}>
                  {t("Crop & Spoilage")}
                </Typography>
              </Stack>
            )}
            {ins?.cross_border_transit !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#15803D" }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#166534" }}>
                  {t("Cross-Border Transit")}
                </Typography>
              </Stack>
            )}
            {ins?.quality_escrow !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: "#15803D" }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#166534" }}>
                  {t("Quality & Escrow")}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default InsuranceBadge;
