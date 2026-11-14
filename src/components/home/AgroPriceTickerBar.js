import React from "react";
import { Box, Chip, Stack, Typography, alpha } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";

const AgroPriceTickerBar = () => {
  const { t } = useTranslation();
  const { data } = useGetAgroPrices();
  const prices = data?.prices || [];

  if (prices.length === 0) return null;

  return (
    <Box
      sx={{
        maxWidth: "1320px",
        width: "100%",
        mx: "auto",
        px: { xs: "12px", md: "16px" },
        mb: { xs: "8px", md: "12px" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: { xs: 1.25, md: 1.75 },
          py: 0.9,
          borderRadius: "10px",
          background: "linear-gradient(90deg, #14532D 0%, #166534 45%, #3F2E1E 100%)",
          color: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(20, 83, 45, 0.14)",
          overflow: "hidden",
        }}
      >
        <Stack
          component={Link}
          href="/market-prices"
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            flexShrink: 0,
            textDecoration: "none",
            color: "#FFFFFF",
            pr: 1.25,
            borderRight: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#4ADE80",
              boxShadow: "0 0 0 3px rgba(74, 222, 128, 0.28)",
            }}
          />
          <Box>
            <Typography sx={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1.1 }}>
              {t("GHANA AGRO INDEX")}
            </Typography>
            <Typography sx={{ fontSize: "9.5px", opacity: 0.82, lineHeight: 1.1 }}>
              GCX · MoFA · Esoko
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {prices.map((row) => {
            const pct = Number(row?.price_change_pct || 0);
            const isUp = row?.trend === "up" || pct > 0;
            const isDown = row?.trend === "down" || pct < 0;
            const trendColor = isUp ? "#86EFAC" : isDown ? "#FCA5A5" : "#E5E7EB";
            const Icon = isUp ? TrendingUpIcon : isDown ? TrendingDownIcon : TrendingFlatIcon;

            return (
              <Stack
                key={row.id || row.commodity}
                component={Link}
                href="/market-prices"
                direction="row"
                alignItems="center"
                spacing={0.6}
                sx={{
                  flexShrink: 0,
                  textDecoration: "none",
                  color: "#FFFFFF",
                  px: 1,
                  py: 0.4,
                  borderRadius: "6px",
                  bgcolor: alpha("#FFFFFF", 0.08),
                  "&:hover": { bgcolor: alpha("#FFFFFF", 0.16) },
                }}
              >
                <Typography sx={{ fontSize: "11.5px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  {row.commodity}
                </Typography>
                <Typography sx={{ fontSize: "11.5px", fontWeight: 800, color: "#FEF3C7", whiteSpace: "nowrap" }}>
                  GH₵{Number(row.wholesale_price_ghs).toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: "10px", opacity: 0.78, whiteSpace: "nowrap" }}>
                  /{row.unit}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.2} sx={{ color: trendColor }}>
                  <Icon sx={{ fontSize: 13 }} />
                  <Typography sx={{ fontSize: "10.5px", fontWeight: 700, whiteSpace: "nowrap" }}>
                    {pct > 0 ? `+${pct}%` : `${pct}%`}
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Stack>

        <Chip
          component={Link}
          href="/market-prices"
          clickable
          size="small"
          label={t("Market Prices →")}
          sx={{
            flexShrink: 0,
            height: 24,
            fontSize: "11px",
            fontWeight: 700,
            bgcolor: "#F59E0B",
            color: "#1F2937",
            "&:hover": { bgcolor: "#D97706", color: "#FFFFFF" },
          }}
        />
      </Stack>
    </Box>
  );
};

export default AgroPriceTickerBar;
