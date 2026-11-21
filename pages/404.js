import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../src/styled-components/CustomStyles.style";
import FourHundred from "../src/components/errors-svg/FourHundred";

export default function Custom400() {
  const { t } = useTranslation();
  const router = useRouter();
  const moduleParam = router.query.module || router.query.module_type || null;
  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: "2rem", md: "5rem" },
        mb: { xs: "72px", md: "0" },
      }}
    >
      <CustomStackFullWidth
        justifyContent="center"
        alignItems="center"
        spacing={4}
      >
        <Stack maxWidth="520px" width="100%" spacing={2} padding="1rem" alignItems="center">
          <FourHundred />
          <Typography align="center" variant="h4" fontWeight={700}>
            {t("We couldn't find that page")}
          </Typography>
          <Typography align="center" color="text.secondary" fontSize="14.5px">
            {t("The listing or page may have moved. Jump straight back into the marketplace below.")}
          </Typography>
          <Button
            component={Link}
            href={homeHref}
            variant="contained"
            sx={{ px: 3, py: 1, borderRadius: "10px", fontWeight: 700, textTransform: "none" }}
          >
            {t("Back to Marketplace")}
          </Button>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center" pt={0.5}>
            <Button component={Link} href="/group-buys" size="small" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
              {t("Group Buys")}
            </Button>
            <Button component={Link} href="/live-farming" size="small" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
              {t("Live Farming")}
            </Button>
            <Button component={Link} href="/market-prices" size="small" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
              {t("Market Prices")}
            </Button>
            <Button component={Link} href="/track-order" size="small" variant="outlined" sx={{ textTransform: "none", borderRadius: "8px" }}>
              {t("Track Order")}
            </Button>
          </Stack>
        </Stack>
      </CustomStackFullWidth>
    </Container>
  );
}
