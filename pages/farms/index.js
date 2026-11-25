import Link from "next/link";
import { Alert, Box, Button, CssBaseline, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CustomContainer from "components/container";
import SEO from "components/seo";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { isFeatureVisible } from "utils/featureFlags";

export default function Farms({ configData }) {
  const { t } = useTranslation();
  const available = isFeatureVisible(configData, "live_farming", false) && configData?.feature_flags?.live_farming?.route_enabled !== false;
  return (
    <>
      <CssBaseline />
      <SEO title={`Farms | ${configData?.business_name || "Aduanefie"}`} configData={configData} />
      <MainLayout configData={configData}>
        <SimpleMobileHeader title="Farms" backHref="/" />
        <CustomContainer>
          <Box component="main" sx={{ py: { xs: 3, md: 4 } }}>
            <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{t("From growing to harvest")}</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 680, mb: 3, lineHeight: 1.7 }}>{t("Follow listed crops and harvest progress, or explore produce from backyard growers. Use Home for everyday shopping and wholesale buying.")}</Typography>
            {!available && <Alert severity="info" sx={{ mb: 3 }}>{t("Farming listings are currently unavailable. Please check back later.")}</Alert>}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              {[
                { title: "Live Farming", body: "Explore growing crops and harvest-ready listings from participating farms.", href: "/live-farming", action: "Explore live farming" },
                { title: "Backyard Farms", body: "Discover listings marked as backyard-grown and follow their harvest progress.", href: "/live-farming?backyard=1", action: "Explore backyard farms" },
              ].map(area => (
                <Stack key={area.href} spacing={2} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
                  <Typography component="h2" variant="h5">{t(area.title)}</Typography>
                  <Typography color="text.secondary" sx={{ flex: 1, lineHeight: 1.7 }}>{t(area.body)}</Typography>
                  {available ? <Button component={Link} href={area.href} variant="contained">{t(area.action)}</Button> : <Typography color="text.secondary">{t("Currently unavailable")}</Typography>}
                </Stack>
              ))}
            </Box>
            <Stack spacing={1} sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <Typography component="h2" variant="h6">{t("Are you a grower?")}</Typography>
              <Typography color="text.secondary">{t("Apply to register your farm or backyard growing business. Applications are reviewed before listings become available.")}</Typography>
              <Box><Button component={Link} href="/store-registration" variant="outlined">{t("Register your farm")}</Button></Box>
            </Stack>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
}

export const getServerSideProps = context => getCommonServerSideProps(context, "live_farming");
