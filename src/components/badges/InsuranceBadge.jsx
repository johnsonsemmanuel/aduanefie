import React from "react";
import { Box, Chip, Stack, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const BADGE_SRC = "/static/badges/trade-insurance-badge.svg";

const InsuranceBadge = ({ item, variant = "compact", sx = {} }) => {
  const { t } = useTranslation();
  const theme = useTheme();
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
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
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
        borderColor: alpha(theme.palette.primary.main, 0.3),
        bgcolor: alpha(theme.palette.primary.main, 0.05),
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
            <Typography sx={{ fontWeight: 700, fontSize: "13px", color: theme.palette.text.primary }}>
              {providerName}
            </Typography>
            <Chip
              size="small"
              label={t("{{rate}}% Coverage Fee", { rate: ratePct })}
              sx={{
                height: 20,
                fontSize: "10.5px",
                fontWeight: 700,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
              }}
            />
          </Stack>
          <Typography sx={{ fontSize: "12px", color: theme.palette.text.secondary, mt: 0.4, lineHeight: 1.45 }}>
            {summary}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.25} sx={{ mt: 1 }}>
            {ins?.crop_spoilage !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: theme.palette.text.primary }}>
                  {t("Crop & Spoilage")}
                </Typography>
              </Stack>
            )}
            {ins?.cross_border_transit !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: theme.palette.text.primary }}>
                  {t("Cross-Border Transit")}
                </Typography>
              </Stack>
            )}
            {ins?.quality_escrow !== false && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
                <Typography sx={{ fontSize: "11px", fontWeight: 600, color: theme.palette.text.primary }}>
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
