import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Subscribe from "./Subscribe";
import { useTranslation } from "react-i18next";

const FooterTop = (props) => {
  const { landingPageData } = props;
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          maxWidth: "1312px",
          width: "100%",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: { xs: "14px", md: "36px" },
            backgroundColor: "background.secondary",
            borderRadius: { xs: "14px", md: "20px" },
            px: { xs: "16px", sm: "24px", md: "40px" },
            py: { xs: "16px", sm: "20px", md: "24px" },
          }}
        >
          {/* Left: text */}
          <Stack
            gap="6px"
            sx={{
              flex: { xs: "1 1 auto", md: "0 1 420px" },
              width: { xs: "100%", md: "auto" },
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "20px", md: "24px" },
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.15,
                letterSpacing: "-0.8px",
              }}
            >
              {landingPageData?.footer_section?.fixed_newsletter_title ?? t("Join Us!")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12.5px", md: "14px" },
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.35,
              }}
            >
              {landingPageData?.footer_section?.fixed_newsletter_sub_title}
            </Typography>
          </Stack>

          {/* Right: subscribe input */}
          <Box sx={{ flex: 1, width: { xs: "100%", md: "auto" }, minWidth: 0 }}>
            <Subscribe />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

FooterTop.propTypes = {};

export default FooterTop;
