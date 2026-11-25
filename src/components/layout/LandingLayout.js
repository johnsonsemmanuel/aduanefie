import { NoSsr, Stack, styled } from "@mui/material";
import HeaderComponent from "../header";
import FooterComponent from "../footer";
import PropTypes from "prop-types";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";
import BottomNav from "components/header/BottomNav";

export const MainLayoutRoot = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  width: "100%",
  maxWidth: "100%",
  overflowX: "clip",
}));

export const LandingLayout = ({ children, configData, landingPageData }) => {
  const { data } = useGetLandingPage();
  const effectiveLandingData = data || landingPageData;

  return (
    <MainLayoutRoot justifyContent="space-between">
      <header>
        <HeaderComponent configData={configData} position="static" />
      </header>
      {children}
      <footer>
        <FooterComponent configData={configData} landingPageData={effectiveLandingData} />
      </footer>
      <BottomNav />
    </MainLayoutRoot>
  );
};

LandingLayout.propTypes = {
  children: PropTypes.node,
};
