import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import MainLayout from "../../src/components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CustomContainer from "../../src/components/container";
import SEO from "../../src/components/seo";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import {
  FALLBACK_TRADE_BLOCS,
  getWholesaleMarketHref,
} from "components/trade/tradeData";

const TradeHub = ({ configData, metaData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const metadata = processMetadata(metaData, {
    title: `Trade - ${configData?.business_name}`,
    description:
      "Source African agricultural commodities in bulk and plan cross-border movement across regional trade blocs.",
    image: configData?.logo_full_url,
  });

  if (!configData) {
    return <div>{t("Configuration data is not available")}</div>;
  }

  return (
    <>
      <CssBaseline />
      <SEO
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <SimpleMobileHeader title="Trade" />
        <CustomContainer>
          <Box sx={{ py: { xs: "16px", md: "32px" } }}>
            {/* Hero */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: { xs: "20px", md: "28px" },
                px: { xs: "20px", sm: "32px", md: "56px" },
                py: { xs: "28px", sm: "40px", md: "56px" },
                color: "#fff",
                backgroundColor: (theme) => theme.palette.primary.deep,
              }}
            >
              <Chip
                label={t("B2B Trade")}
                size="small"
                sx={{
                  mb: "14px",
                  bgcolor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontWeight: 600,
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "26px", sm: "34px", md: "44px" },
                  fontWeight: 700,
                  lineHeight: 1.12,
                  letterSpacing: "-1px",
                  maxWidth: "720px",
                }}
              >
                {t("African agricultural trade, in one place")}
              </Typography>
              <Typography
                sx={{
                  mt: "12px",
                  fontSize: { xs: "14px", md: "16px" },
                  lineHeight: 1.55,
                  maxWidth: "640px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {t(
                  "Buy farm produce in bulk from verified sellers and prepare cross-border shipments across Africa's regional trade blocs."
                )}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                gap="12px"
                sx={{ mt: "24px", maxWidth: { xs: "100%", sm: "none" } }}
              >
                <Button
                  variant="contained"
                  onClick={() => router.push(getWholesaleMarketHref())}
                  sx={{
                    bgcolor: "#fff",
                    color: "primary.deep",
                    fontWeight: 700,
                    px: "22px",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  {t("Shop Wholesale Market")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/trade/blocs")}
                  sx={{
                    borderColor: "rgba(255,255,255,0.7)",
                    color: "#fff",
                    fontWeight: 600,
                    px: "22px",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {t("Explore Trade Blocs")}
                </Button>
              </Stack>
            </Box>

            {/* Live now */}
            <Box sx={{ mt: { xs: "28px", md: "48px" } }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "20px", md: "26px" },
                  fontWeight: 700,
                  letterSpacing: "-0.6px",
                }}
              >
                {t("Available now")}
              </Typography>
              <Typography
                sx={{ mt: "6px", fontSize: "14px", color: "text.secondary" }}
              >
                {t(
                  "Start sourcing today. Quote requests and protected payments are being prepared next."
                )}
              </Typography>

              <Box
                sx={{
                  mt: "18px",
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: "16px",
                }}
              >
                <Box
                  sx={{
                    p: { xs: "20px", md: "26px" },
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>
                    {t("Wholesale Market")}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "text.secondary", flex: 1 }}
                  >
                    {t(
                      "Browse fresh produce and agro-commodities listed by farms and suppliers, with delivery to your zone."
                    )}
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => router.push(getWholesaleMarketHref())}
                    >
                      {t("Browse commodities")}
                    </Button>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: { xs: "20px", md: "26px" },
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>
                    {t("Trade blocs & corridors")}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "14px", color: "text.secondary", flex: 1 }}
                  >
                    {t(
                      "Compare the main cross-border freight lanes connecting ECOWAS, SADC, EAC and COMESA markets."
                    )}
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push("/trade/blocs")}
                    >
                      {t("View blocs")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Regional blocs at a glance */}
            <Box sx={{ mt: { xs: "28px", md: "44px" } }}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "20px", md: "26px" },
                  fontWeight: 700,
                  letterSpacing: "-0.6px",
                }}
              >
                {t("Regional trade blocs")}
              </Typography>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap="10px"
                sx={{ mt: "14px" }}
              >
                {FALLBACK_TRADE_BLOCS.map((bloc) => (
                  <Chip
                    key={bloc.slug}
                    label={bloc.shortName || bloc.slug?.toUpperCase() || bloc.name}
                    onClick={() => router.push(`/trade/blocs/${bloc.slug}`)}
                    sx={{ fontWeight: 600, px: "6px" }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Coming next */}
            <Box
              sx={{
                mt: { xs: "28px", md: "44px" },
                p: { xs: "20px", md: "28px" },
                borderRadius: "20px",
                bgcolor: "background.secondary",
              }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: 700 }}>
                {t("Coming next")}
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  mt: "10px",
                  pl: "20px",
                  display: "grid",
                  gap: "6px",
                  color: "text.secondary",
                  fontSize: "14px",
                }}
              >
                <li>{t("Request-for-quote (RFQ) from multiple sellers")}</li>
                <li>{t("Escrow-protected trade contracts and documents")}</li>
                <li>{t("Logistics, inspection and sourcing support")}</li>
              </Box>
            </Box>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default TradeHub;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "trade_page");
};
