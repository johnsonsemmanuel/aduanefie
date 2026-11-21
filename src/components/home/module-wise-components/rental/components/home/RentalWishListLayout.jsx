import { Box, Button, Typography } from "@mui/material";
import CompactMobileHeader from "components/common/CompactMobileHeader";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

/**
 * The Rental addon has no wishlist screen yet. Keep the route consistent with
 * every other module's /home/wishlist: a mobile header with the mode switcher,
 * plus a low-data empty state and a clear next action.
 */
export default function RentalWishListLayout() {
  const router = useRouter();
  const { t } = useTranslation();

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;
  const browseHref = moduleParam
    ? `/rental/vehicle-search?module=${moduleParam}`
    : "/rental/vehicle-search";

  return (
    <>
      <CompactMobileHeader title="Favourite" />
      <Box sx={{ px: 2, py: 5, textAlign: "center" }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {t("No saved vehicles yet")}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t("Tap the heart on a vehicle to save it here for later.")}
        </Typography>
        <Button variant="contained" onClick={() => router.push(browseHref)}>
          {t("Browse vehicles")}
        </Button>
      </Box>
    </>
  );
}
