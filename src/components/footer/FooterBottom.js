import { IconButton, NoSsr, Typography, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { t } from "i18next";
import { useRouter } from "next/router";
import CustomImageContainer from "../CustomImageContainer";
import {
  Facebook,
  Instragram,
  LinkedIn,
  Pinterest,
  Twitter,
} from "./footer-middle/Icon";

const FooterBottom = ({ configData }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClickToRoute = (href) => {
    router.push(href, undefined, { shallow: true });
  };

  const iconHandler = (name) => {
    switch (name) {
      case "facebook":
        return <Facebook />;
      case "instagram":
        return <Instragram />;
      case "twitter":
        return <Twitter />;
      case "linkedin":
        return <LinkedIn />;
      case "pinterest":
        return <Pinterest />;
      default:
        return <Twitter />;
    }
  };

  const socialIcons = (
    <Stack
      direction="row"
      alignItems="center"
      gap="16px"
      sx={{ flexShrink: 0 }}
    >
      {configData?.social_media?.map((item, index) => (
        <IconButton
          key={index}
          onClick={() => window.open(item.link)}
          sx={{
            padding: 0,
            color: theme.palette.primary.icon,
            transition: "all ease 0.3s",
            "&:hover": {
              transform: "scale(1.14)",
              color: theme.palette.primary.main,
              backgroundColor: "transparent",
            },
          }}
        >
          {iconHandler(item.name)}
        </IconButton>
      ))}
    </Stack>
  );

  const policyLinks = ({ mobile } = {}) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: mobile ? "center" : { md: "center", lg: "flex-end" },
        columnGap: mobile ? "16px" : { md: "20px", lg: "28px" },
        rowGap: mobile ? "6px" : "8px",
        maxWidth: "100%",
      }}
    >
      {[
        {
          label: "Terms & Conditions",
          href: "/terms-and-conditions",
          show: true,
        },
        { label: "Privacy Policy", href: "/privacy-policy", show: true },
        {
          label: "Refund Policy",
          href: "/refund-policy",
          show: configData?.refund_policy !== 0,
        },
        {
          label: "Cancellation Policy",
          href: "/cancellation-policy",
          show: configData?.cancelation_policy !== 0,
        },
        {
          label: "Shipping Policy",
          href: "/shipping-policy",
          show: configData?.shipping_policy !== 0,
        },
      ].map(
        ({ label, href, show }) =>
          show && (
            <Typography
              key={href}
              onClick={() => handleClickToRoute(href)}
              sx={{
                fontSize: mobile ? "12px" : "13px",
                fontWeight: mobile ? 500 : 400,
                color: "neutral.1050",
                lineHeight: 1.3,
                letterSpacing: mobile ? "-0.2px" : 0,
                whiteSpace: "nowrap",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              {t(label)}
            </Typography>
          )
      )}
    </Box>
  );

  return (
    <NoSsr>
      <Box
        sx={{
          backgroundColor: "background.secondary",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
        }}
      >
        {/* ── MOBILE ── */}
        <Stack
          gap="14px"
          alignItems="center"
          sx={{
            display: { xs: "flex", md: "none" },
            py: "16px",
            px: "16px",
            width: "100%",
          }}
        >
          {socialIcons}
          {policyLinks({ mobile: true })}
          <Stack gap="8px" alignItems="center" sx={{ width: "100%" }}>
            <CustomImageContainer
              src={configData?.logo_full_url}
              alt={configData?.business_name}
              width="auto"
              height="18px"
              objectfit="contain"
            />
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 400,
                color: "neutral.1050",
                lineHeight: 1.4,
                letterSpacing: "-0.2px",
                whiteSpace: "normal",
                wordBreak: "break-word",
                textAlign: "center",
                maxWidth: "100%",
                px: "4px",
              }}
            >
              {configData?.footer_text}
            </Typography>
          </Stack>
        </Stack>

        {/* ── DESKTOP ── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexWrap: "wrap",
            maxWidth: "1312px",
            width: "100%",
            mx: "auto",
            px: { md: "32px", lg: "40px", xl: "16px" },
            py: "18px",
            alignItems: "center",
            justifyContent: "space-between",
            columnGap: { md: "24px", lg: "32px" },
            rowGap: "12px",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap="20px"
            sx={{ flex: "1 1 320px", minWidth: 0 }}
          >
            {socialIcons}

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 400,
                color: "neutral.1050",
                lineHeight: 1.4,
                whiteSpace: "normal",
                wordBreak: "break-word",
                flex: 1,
                minWidth: "200px",
              }}
            >
              {configData?.footer_text}
            </Typography>
          </Stack>

          {policyLinks()}
        </Box>
      </Box>
    </NoSsr>
  );
};

FooterBottom.propTypes = {};

export default FooterBottom;
