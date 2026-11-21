import React, { useEffect } from "react";
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
        title={effectiveConfig?.business_name ? `Live Farming | ${effectiveConfig.business_name}` : "Live Farming | Aduanefie"}
        businessName={effectiveConfig?.business_name}
        configData={effectiveConfig}
      />
      <MainLayout configData={effectiveConfig}>
        <SimpleMobileHeader title="Live Farming" backHref="/home" />
        <CustomContainer>
          <Box sx={{ pt: { xs: 1.5, md: 4 }, pb: { xs: 3, md: 5 } }}>
            <LiveFarmingSection limit={24} showViewAll={false} hideIfEmpty={false} />
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
