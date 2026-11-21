import React from "react";
import { Box, Button, Stack, Typography, alpha, useTheme } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetAgroPrices } from "api-manage/hooks/react-query/trade/useGetAgroPrices";

const AgroPriceTickerBar = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data, isError } = useGetAgroPrices();
  const prices = data?.prices || [];

  if (prices.length === 0) {
    if (isError) {
      return (
        <Box sx={{ maxWidth: "1320px", mx: "auto", px: { xs: "16px", md: 0 }, my: "10px" }}>
          <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
            {t("Market prices are temporarily unavailable. ")}
            <Button component={Link} href="/market-prices" size="small" sx={{ minWidth: 0, p: 0 }}>
              {t("Check market prices")}
            </Button>
          </Typography>
        </Box>
      );
    }
    return null;
  }

  const tickerItems = [...prices, ...prices];

  return (
    <Box
      sx={{
        maxWidth: "1320px",
        width: "100%",
        mx: "auto",
        px: { xs: "16px", md: 0 },
        my: { xs: "10px", md: "14px" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          px: { xs: 1.5, md: 2 },
          py: 1,
          borderRadius: "10px",
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
        }}
      >
        <Stack
          component={Link}
          href="/market-prices"
          direction="column"
          justifyContent="center"
          sx={{
            flexShrink: 0,
            textDecoration: "none",
            color: theme.palette.text.primary,
            pr: 1.5,
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: theme.palette.primary.main,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {t("Ghana Agro Index")}
          </Typography>
          <Typography
            sx={{
              fontSize: "10px",
              color: theme.palette.text.secondary,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            GCX · MoFA · Esoko
          </Typography>
        </Stack>

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
            "&:hover .agro-ticker-track": {
              animationPlayState: "paused",
            },
            "@keyframes agroTickerScroll": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
          }}
        >
          <Stack
            className="agro-ticker-track"
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              display: "inline-flex",
              width: "max-content",
              animation: "agroTickerScroll 42s linear infinite",
            }}
          >
            {tickerItems.map((row, idx) => {
              const pct = Number(row?.price_change_pct || 0);
              const isUp = row?.trend === "up" || pct > 0;
              const isDown = row?.trend === "down" || pct < 0;
              const trendColor = isUp
                ? theme.palette.success.main
                : isDown
                  ? theme.palette.error.main
                  : theme.palette.text.secondary;
              const Icon = isUp
                ? TrendingUpIcon
                : isDown
                  ? TrendingDownIcon
                  : TrendingFlatIcon;

              return (
                <Stack
                  key={`${row.id || row.commodity}-${idx}`}
                  component={Link}
                  href="/market-prices"
                  direction="row"
                  alignItems="center"
                  spacing={0.6}
                  sx={{
                    flexShrink: 0,
                    textDecoration: "none",
                    color: theme.palette.text.primary,
                    px: 1,
                    py: 0.35,
                    borderRadius: "6px",
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <Typography sx={{ fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {row.commodity}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      whiteSpace: "nowrap",
                    }}
                  >
                    GH₵{Number(row.wholesale_price_ghs).toLocaleString()}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "10.5px",
                      color: theme.palette.text.secondary,
                      whiteSpace: "nowrap",
                    }}
                  >
                    /{row.unit}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.2} sx={{ color: trendColor }}>
                    <Icon sx={{ fontSize: 13 }} />
                    <Typography sx={{ fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {pct > 0 ? `+${pct}%` : `${pct}%`}
                    </Typography>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Box>

        <Button
          component={Link}
          href="/market-prices"
          variant="outlined"
          size="small"
          sx={{
            flexShrink: 0,
            textTransform: "none",
            fontSize: "11.5px",
            fontWeight: 600,
            py: 0.4,
            px: 1.25,
            borderRadius: "6px",
            whiteSpace: "nowrap",
          }}
        >
          {t("All Prices")}
        </Button>
      </Stack>
    </Box>
  );
};

export default AgroPriceTickerBar;
