import React from "react";
import { Box } from "@mui/material";
import CustomContainer from "components/container";
import MainLayout from "components/layout/MainLayout";
import SEO from "components/seo";
import LiveFarmingSection from "components/home/live-farming/LiveFarmingSection";

const LiveFarmingPage = ({ configData }) => {
  return (
    <>
      <SEO title={configData?.business_name ? `Live Farming | ${configData.business_name}` : "Live Farming | Aduanefie"} />
      <MainLayout configData={configData}>
        <CustomContainer>
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            <LiveFarmingSection limit={24} showViewAll={false} hideIfEmpty={false} />
          </Box>
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default LiveFarmingPage;
