import Link from "next/link";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const MARKETS = [
  { title: "Shop nearby", description: "Fresh produce from farms and suppliers. Set your address to check delivery availability.", href: "/home?module=1", action: "Browse nearby market" },
  { title: "Buy wholesale", description: "Source larger quantities for your business. Check pack sizes, minimum orders and delivery terms.", href: "/home?module=2", action: "Browse wholesale market" },
  { title: "Trade across Africa", description: "Explore regional trade information and available corridors. Cross-border commitments are subject to approval.", href: "/trade", action: "Explore trade services" },
];

export default function MarketEntryActions() {
  const { t } = useTranslation();
  return (
    <Box component="section" aria-label={t("Choose your market")} sx={{ py: 3 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
        {MARKETS.map(market => (
          <Stack key={market.href} spacing={2} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography component="h2" variant="h6">{t(market.title)}</Typography>
            <Typography color="text.secondary" sx={{ flex: 1, lineHeight: 1.6 }}>{t(market.description)}</Typography>
            <Button component={Link} href={market.href} variant="outlined">{t(market.action)}</Button>
          </Stack>
        ))}
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
        <Typography color="text.secondary">{t("Grow your business with Aduanefie")}</Typography>
        <Button component={Link} href="/store-registration">{t("Register your farm or store")}</Button>
      </Stack>
    </Box>
  );
}
