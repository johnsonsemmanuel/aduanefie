import { useRouter } from "next/router";
import { Box } from "@mui/system";
import FooterBottom from "./FooterBottom";
import FooterMiddle from "./footer-middle/FooterMiddle";
import FooterTop from "./footer-top/FooterTop";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";
import { useEffect } from "react";

const FooterComponent = ({ configData }) => {
  const router = useRouter();
  const { data: landingPageData } = useGetLandingPage();

  const isLandingPage = router.pathname === "/welcome";
  const isHomePage = router.pathname === "/home";

  // /home has ScrollUpButton above the BottomNav → needs more clearance
  // other pages just need BottomNav height (65px)
  const mobileBottomMargin = isLandingPage ? 0 : isHomePage ? "120px" : "65px";

  return (
    /* Outer wrapper — #f7f7f7 background */
    <Box
      id="site-footer"
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        mt: { xs: "1.5rem", sm: "3rem", md: isLandingPage ? "2rem" : "4rem" },
        mb: { xs: mobileBottomMargin, md: 0 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Main white card — top corners rounded */}
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

      {/* Footer bottom bar — #f2f2f2, no radius */}
      <FooterBottom configData={configData} />
    </Box>
  );
};

export default FooterComponent;
