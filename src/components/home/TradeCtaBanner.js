import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

// Compact entry point from the storefront into the B2B trade hub. Shown on the
// Wholesale Market home so buyers can discover corridors and RFQ features
// without adding another item to the main header.
const TradeCtaBanner = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Box
      sx={{
        borderRadius: "18px",
        px: { xs: "16px", sm: "22px", md: "28px" },
        py: { xs: "16px", sm: "18px", md: "20px" },
        backgroundColor: (theme) => theme.palette.primary.deep,
        color: "#fff",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: "14px",
      }}
    >
      <Stack gap="2px">
        <Typography
          sx={{ fontSize: { xs: "14.5px", md: "18px" }, fontWeight: 700 }}
        >
          {t("Buying in bulk?")}
        </Typography>
        <Typography
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "13px",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          {t(
            "Plan cross-border shipments across African trade blocs from one place."
          )}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/market-prices")}
          sx={{
            flex: { xs: 1, sm: "none" },
            borderColor: "rgba(255,255,255,0.55)",
            color: "#fff",
            fontWeight: 600,
            fontSize: { xs: "12px", sm: "13px" },
            whiteSpace: "nowrap",
            "&:hover": {
              borderColor: "#fff",
              bgcolor: "rgba(255,255,255,0.12)",
            },
          }}
        >
          {t("Market Prices")}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => router.push("/trade")}
          sx={{
            flex: { xs: 1, sm: "none" },
            bgcolor: "#fff",
            color: "primary.deep",
            fontWeight: 700,
            fontSize: { xs: "12px", sm: "13px" },
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
          }}
        >
          {t("B2B Trade")}
        </Button>
      </Stack>
    </Box>
  );
};

export default TradeCtaBanner;
