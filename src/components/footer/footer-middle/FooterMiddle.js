import { Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ractangle from "../../../../public/static/footer/Rectangle.svg";
import magnifying from "../../../../public/static/footer/magnifying.svg";
import phone from "../../../../public/static/footer/phone.svg";
import CustomImageContainer from "../../CustomImageContainer";
import LocationViewOnMap from "../../Map/location-view/LocationViewOnMap";
import AppLinks from "./AppLinks";
import RouteLinks from "./RouteLinks";
import SomeInfo from "./SomeInfo";
import { isValidLocation } from "helper-functions/validLocation";

const VerticalDivider = () => (
  <Box
    sx={{
      width: "1px",
      alignSelf: "stretch",
      backgroundColor: "divider",
      flexShrink: 0,
    }}
  />
);

const HorizontalDivider = () => (
  <Box sx={{ width: "100%", height: "1px", backgroundColor: "divider" }} />
);

const FooterMiddle = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  // The backend now returns null when no valid business pin is configured.
  // Show the address, but never open a floating/placeholder map.
  const hasBusinessLocation = isValidLocation({
    lat: configData?.default_location?.lat,
    lng: configData?.default_location?.lng,
  });
  const openLocationMap = () => {
    if (hasBusinessLocation) setOpen(true);
  };

  const appLinkData = {
    app_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url,
    play_store_link:
      landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url,
    app_status:
      landingPageData?.user_app_download_section?.download_user_app_links?.apple_store_url_status,
    play_status:
      landingPageData?.user_app_download_section?.download_user_app_links?.playstore_url_status,
  };

  const rawMarketLinks = configData?.footer_links?.markets || [
    { label: "Browse Farms", href: "/store/popular", active: true },
    { label: "Track Order", href: "/track-order", active: true },
  ];
  const marketLinks = rawMarketLinks.filter((link) => {
    if (link?.active === false) return false;
    if (link?.feature && configData?.feature_flags?.[link.feature]?.public_visible === false) {
      return false;
    }
    return true;
  });

  const rawPartnerLinks = configData?.footer_links?.partners || [
    { label: "Register Your Farm", href: "/store-registration", active: true, key: "restaurant_owner" },
    { label: "Logistics Partner", href: "/deliveryman-registration", active: true, key: "delivery_man" },
    { label: "About Us", href: "/about-us", active: true },
    { label: "Help & Support", href: "/help-and-support", active: true },
  ];
  const partnerLinks = rawPartnerLinks.filter((link) => link?.active !== false);

  return (
    <Box sx={{ width: "100%", maxWidth: "1312px", mx: "auto", px: 0 }}>
      {/* ── MOBILE LAYOUT ── */}
      <Stack
        gap="16px"
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Brand + App */}
        <Stack gap="10px" alignItems="center" sx={{ width: "100%" }}>
          <CustomImageContainer
            src={configData?.logo_full_url}
            alt={configData?.business_name}
            width="auto"
            height="34px"
            objectfit="contain"
          />
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 400,
              color: "neutral.500",
              lineHeight: 1.4,
              textAlign: "center",
              maxWidth: "360px",
            }}
          >
            {landingPageData?.footer_section?.fixed_footer_description}
          </Typography>
        </Stack>

        <Stack gap="6px" alignItems="center" sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 600,
              color: "neutral.500",
              letterSpacing: "-0.2px",
              lineHeight: 1.2,
            }}
          >
            {t("Available on")}
          </Typography>
          <AppLinks landingPageData={appLinkData} />
        </Stack>

        <HorizontalDivider />

        {/* Quick Links */}
        <Stack gap="10px" alignItems="center" sx={{ width: "100%" }}>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
            }}
          >
            {t("Agro Markets")}
          </Typography>
          <RouteLinks configData={configData} links={marketLinks} centered />
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.3px",
              lineHeight: 1.2,
              mt: "4px",
            }}
          >
            {t("Trade & Partners")}
          </Typography>
          <RouteLinks configData={configData} links={partnerLinks} centered />
        </Stack>

        <HorizontalDivider />

        {/* Contact Info - compact responsive grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
            gap: "12px",
            width: "100%",
            alignItems: "stretch",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <SomeInfo
              image={ractangle}
              alt="mail"
              title="Send us mails"
              info={configData?.email}
              t={t}
              href={`mailto:${configData?.email}`}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <SomeInfo
              image={phone}
              alt="phone"
              title="Contact us"
              info={configData?.phone}
              t={t}
              href={`tel:${configData?.phone}`}
            />
          </Box>
          <Box
            sx={{
              minWidth: 0,
              gridColumn: { xs: "1 / -1", sm: "auto" },
            }}
            onClick={openLocationMap}
          >
            <SomeInfo
              image={magnifying}
              alt="location"
              title="Find us here"
              info={configData?.address}
              t={t}
              href={false}
            />
          </Box>
        </Box>
      </Stack>

      {/* ── DESKTOP LAYOUT ── */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: { md: "28px", lg: "48px" },
          width: "100%",
        }}
      >
        {/* Column 1: Brand + App */}
        <Stack
          gap="16px"
          sx={{ width: { md: "240px", lg: "300px" }, flexShrink: 0 }}
        >
          <Stack gap="12px" alignItems="flex-start">
            <Box
              sx={{
                img: { transition: "all ease 0.5s" },
                "&:hover img": { transform: "scale(1.04)" },
              }}
            >
              <CustomImageContainer
                src={configData?.logo_full_url}
                alt={configData?.business_name}
                width="auto"
                height="40px"
                objectfit="contain"
              />
            </Box>
            <Typography
              sx={{
                fontSize: "13.5px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.45,
                letterSpacing: 0,
              }}
            >
              {landingPageData?.footer_section?.fixed_footer_description}
            </Typography>
          </Stack>
          <Stack gap="8px">
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                color: "neutral.500",
                letterSpacing: "-0.2px",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              {t("Available on")}
            </Typography>
            <AppLinks landingPageData={appLinkData} align="flex-start" />
          </Stack>
        </Stack>

        <VerticalDivider />

        {/* Column 2: Agro Markets */}
        <Stack gap="6px" sx={{ flexShrink: 0, minWidth: "155px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.4px",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              mb: "4px",
            }}
          >
            {t("Agro Markets")}
          </Typography>
          <RouteLinks configData={configData} links={marketLinks} />
        </Stack>

        <VerticalDivider />

        {/* Column 3: Trade & Partners */}
        <Stack gap="6px" sx={{ flexShrink: 0, minWidth: "155px" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 700,
              color: "neutral.1050",
              letterSpacing: "-0.4px",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              mb: "4px",
            }}
          >
            {t("Trade & Partners")}
          </Typography>
          <RouteLinks configData={configData} links={partnerLinks} />
        </Stack>

        <VerticalDivider />

        {/* Column 3: Contact Info */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: { md: "16px", lg: "24px" },
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <SomeInfo
              image={ractangle}
              alt="mail"
              title="Send us mails"
              info={configData?.email}
              t={t}
              href={`mailto:${configData?.email}`}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <SomeInfo
              image={phone}
              alt="phone"
              title="Contact us"
              info={configData?.phone}
              t={t}
              href={`tel:${configData?.phone}`}
            />
          </Box>
          <Box
            onClick={openLocationMap}
            sx={{
              minWidth: 0,
              cursor: hasBusinessLocation ? "pointer" : "default",
            }}
          >
            <SomeInfo
              image={magnifying}
              alt="location"
              title="Find us here"
              info={configData?.address}
              t={t}
              href={false}
            />
          </Box>
        </Box>
      </Box>

      {open && hasBusinessLocation && (
        <LocationViewOnMap
          open={open}
          handleClose={() => setOpen(false)}
          latitude={configData?.default_location?.lat}
          longitude={configData?.default_location?.lng}
          address={configData?.address}
          isFooter
        />
      )}
    </Box>
  );
};

FooterMiddle.propTypes = {};

export default FooterMiddle;
