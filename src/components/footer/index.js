import { useRouter } from "next/router";
import { Box } from "@mui/system";
import FooterBottom from "./FooterBottom";
import FooterMiddle from "./footer-middle/FooterMiddle";
import FooterTop from "./footer-top/FooterTop";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { DESKTOP_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";
import {
  MOBILE_BOTTOM_NAV_HEIGHT,
  shouldShowMobileBottomNav,
} from "utils/mobileBottomNav";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const FooterComponent = ({ configData: propConfigData }) => {
  const router = useRouter();
  const { configData: reduxConfigData } = useSelector((state) => state.configData);
  const configData =
    propConfigData && Object.keys(propConfigData).length > 0
      ? propConfigData
      : reduxConfigData;
  const { data: landingPageData } = useGetLandingPage();

  const isLandingPage = router.pathname === "/welcome";
  const isHomePage = router.pathname === "/" || router.pathname === "/home";
  // MainLayout uses the same helper to decide whether to render the nav, so
  // the footer can't reserve clearance for a nav that isn't there.
  const showBottomNav = shouldShowMobileBottomNav({
    pathname: router.pathname,
    page: router.query.page,
  });

  // Only reserve space when fixed bottom chrome is actually rendered.
  // LandingLayout and MainLayout share BottomNav; /home also has ScrollUpButton above it.
  const mobileBottomMargin =
    !showBottomNav
      ? 0
      : isHomePage
      ? "120px"
      : `${MOBILE_BOTTOM_NAV_HEIGHT}px`;

  return (
    /* Outer wrapper - #f7f7f7 background */
    <Box
      id="site-footer"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        mt: { xs: "1.5rem", sm: "3rem", md: isLandingPage ? "2rem" : "4rem" },
        mb: showBottomNav ? `calc(${mobileBottomMargin} + env(safe-area-inset-bottom, 0px))` : 0,
        // BottomNav hides at the shared 1180px cutoff, not the theme's md=1000px.
        [`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]: {
          mb: 0,
        },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Main white card - top corners rounded */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: { xs: "20px 20px 0px 0px", md: "40px 40px 4px 4px" },
          px: { xs: "16px", sm: "24px", md: "40px", lg: "64px" },
          pt: { xs: "20px", sm: "28px", md: "48px" },
          pb: { xs: "20px", sm: "28px", md: "40px" },
          display: "flex",
          flexDirection: "column",
          gap: { xs: "20px", md: "36px" },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <FooterTop landingPageData={landingPageData} />
        <FooterMiddle
          configData={configData}
          landingPageData={landingPageData}
        />
      </Box>

      {/* Footer bottom bar - #f2f2f2, no radius */}
      <FooterBottom configData={configData} />
    </Box>
  );
};

export default FooterComponent;
