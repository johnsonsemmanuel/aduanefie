import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import MainLayout from "../../../src/components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import CustomContainer from "../../../src/components/container";
import SEO from "../../../src/components/seo";
import { processMetadata } from "utils/fetchPageMetaData";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useTradeBlocs } from "api-manage/hooks/react-query/trade/useTradeData";
import { FALLBACK_TRADE_BLOCS } from "components/trade/tradeData";
import BlocCard from "components/trade/BlocCard";

const TradeBlocs = ({ configData, metaData }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useTradeBlocs();
  // Keep the seeded bloc copy visible while the trade service is not live.
  const blocs = data?.length ? data : FALLBACK_TRADE_BLOCS;

  const metadata = processMetadata(metaData, {
    title: `Trade blocs - ${configData?.business_name}`,
    description:
      "Explore Africa's regional trade blocs and the freight corridors that connect their markets.",
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
        <SimpleMobileHeader title="Trade Blocs" backHref="/trade" />
        <CustomContainer>
          <Box sx={{ py: { xs: "16px", md: "32px" } }}>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "24px", md: "34px" },
                fontWeight: 700,
                letterSpacing: "-0.8px",
              }}
            >
              {t("Regional trade blocs")}
            </Typography>
            <Typography
              sx={{
                mt: "8px",
                maxWidth: "680px",
                fontSize: "14.5px",
                lineHeight: 1.5,
                color: "text.secondary",
              }}
            >
              {t(
                "Trade across ECOWAS, SADC, EAC and COMESA corridors. Open a bloc to see the freight lanes, transit times and cold-chain options between its member countries."
              )}
            </Typography>

            <Box
              sx={{
                mt: { xs: "20px", md: "28px" },
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
                gap: "16px",
              }}
            >
              {blocs.map((bloc) => (
                <BlocCard
                  key={bloc.slug}
                  bloc={bloc}
                  onOpen={(item) => router.push(`/trade/blocs/${item.slug}`)}
                />
              ))}
            </Box>
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default TradeBlocs;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "trade_blocs_page");
};
