import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomContainer from "../../container";
import HeroLocationForm from "./HeroLocationForm";
import HeroTitleSection from "./HeroTitleSection";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import MarketEntryActions from "../MarketEntryActions";

const DynamicModuleSelection = dynamic(() =>
  import("./module-selection/ModuleSelectionRaw")
);
const HeroSection = ({ landingPageDataheroSection }) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <CustomContainer>
      <CustomBoxFullWidth
        sx={{
          marginTop: { xs: 2, sm: 3, md: 4 },
          borderRadius: "20px",
          position: "relative",
          backgroundColor: theme.palette.primary.lite,
          padding: { xs: "13px", md: "30px" },
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center"
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
          <CustomStackFullWidth spacing={2} sx={{ mb: 3, maxWidth: "780px", margin: "0 auto" }}>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "18px", sm: "30px", md: "40px" },
                fontWeight: "bold",
                color: theme.palette.neutral[1000],
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              <DollarSignHighlighter theme={theme} text={landingPageDataheroSection?.header_title && landingPageDataheroSection.header_title !== "$Your e-Commerce!$" ? landingPageDataheroSection.header_title : "Fresh produce. Stronger connections."} />

            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "12px", sm: "16px" },
                fontWeight: "400",
                color: theme.palette.text.secondary,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {landingPageDataheroSection?.header_sub_title && landingPageDataheroSection.header_sub_title !== "Venture Starts Here" ? landingPageDataheroSection.header_sub_title : "Shop nearby farms, buy wholesale, and explore agricultural trade across Africa."}
            </Typography>
          </CustomStackFullWidth>
          <Box sx={{ marginTop: { xs: "1rem", md: "1.5rem" }, width: "100%", marginInline: "auto" }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "20px" },
                fontWeight: "500",
                color: theme.palette.neutral[500],
                textAlign: "center",
                lineHeight: 1.2,
                marginBottom: { xs: "10px", md: "1rem" },

              }}
            >
              {landingPageDataheroSection?.header_tag_line?.replace(/\$/g, "") || "Choose your location to see available markets"}
            </Typography>
            <HeroTitleSection
              landingPageData={landingPageDataheroSection}
            />
          </Box>
        </Box>
      </CustomBoxFullWidth>
      <MarketEntryActions />

    </CustomContainer>
  );
};

export default HeroSection;
