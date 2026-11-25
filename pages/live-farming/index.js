import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Alert } from "@mui/material";
import { isFeatureVisible } from "utils/featureFlags";
import { Box, CssBaseline } from "@mui/material";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SimpleMobileHeader from "components/common/SimpleMobileHeader";
import SEO from "components/seo";
import LiveFarmingSection from "components/home/live-farming/LiveFarmingSection";
import { getCommonServerSideProps } from "utils/serverSidePropsHelper";
import { useDispatch } from "react-redux";
import { useGetConfigData } from "api-manage/hooks/useGetConfigData";
import { setConfigData } from "redux/slices/configData";

const LiveFarmingPage = ({ configData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const backyardOnly = router.query.backyard === "1";
  const title = backyardOnly ? "Backyard Farms" : "Live Farming";
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    } else {
      configRefetch();
    }
  }, [configData, configRefetch, dispatch]);

  useEffect(() => {
    if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    }
  }, [dataConfig, dispatch]);

  const effectiveConfig = configData || dataConfig;

  return (
    <>
      <CssBaseline />
      <SEO
        title={effectiveConfig?.business_name ? `${title} | ${effectiveConfig.business_name}` : `${title} | Aduanefie`}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <SimpleMobileHeader title={title} backHref="/farms" />
        <CustomContainer>
          <Box sx={{ pt: { xs: 1, md: 3 }, pb: { xs: 3, md: 5 } }}>
            {isFeatureVisible(effectiveConfig, "live_farming", false) && effectiveConfig?.feature_flags?.live_farming?.route_enabled !== false ? (
              <LiveFarmingSection key={backyardOnly ? "backyard" : "all"} initialBackyardOnly={backyardOnly} lockBackyard={backyardOnly} titleOverride={title} limit={24} showViewAll={false} hideIfEmpty={false} />
            ) : <Alert severity="info">Farming listings are currently unavailable. Please check back later.</Alert>}
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default LiveFarmingPage;

export const getServerSideProps = async (context) => {
  return await getCommonServerSideProps(context, "live_farming");
};
