import {
  Box,
  Chip,
  Drawer,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { t } from "i18next";
import useGetGroupedCart from "../../api-manage/hooks/react-query/add-cart/useGetGroupedCart";
import AccountMenuPanel from "./second-navbar/account-popover/AccountMenuPanel";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";

const MARKETPLACE_LINKS = [
  { label: "Home", path: "/home", icon: "fi fi-rr-home" },
  { label: "Group Buys", path: "/group-buys", icon: "fi fi-rr-users-alt" },
  { label: "Live Farming", path: "/live-farming", icon: "fi fi-rr-leaf" },
  { label: "Market Prices", path: "/market-prices", icon: "fi fi-rr-chart-line-up" },
  { label: "B2B Trade", path: "/trade", icon: "fi fi-rr-globe" },
  { label: "Track Order", path: "/track-order", icon: "fi fi-rr-truck-side" },
];

const PARTNER_SUPPORT_LINKS = [
  { label: "Become a Marketer", path: "/become-a-marketer", icon: "fi fi-rr-briefcase" },
  { label: "Register Farm / Store", path: "/store-registration", icon: "fi fi-rr-shop" },
  { label: "Help & Support", path: "/help-and-support", icon: "fi fi-rr-headset" },
];

const ProfileDrawer = ({ open, onClose, onSignInClick }) => {
  const theme = useTheme();
  const router = useRouter();
  const { refetch: cartListRefetch } = useGetGroupedCart();

  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ zIndex: 1400 }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "100%",
          height: "90vh",
          backgroundColor: "background.default",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        sx={{
          px: "12px",
          pt: "6px",
          pb: "6px",
          backgroundColor: "background.default",
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label={t("Close")}
          sx={{ p: "6px", color: "text.primary" }}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
      </Stack>
      {/* Header */}
      {/* <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{
          px: "16px",
          py: "12px",
          height: "56px",
          backgroundColor: "background.default",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ p: "4px", color: "text.primary" }}
          aria-label={token ? t("Back") : t("Close")}
        >
          <i
            className={token ? "fi fi-rr-arrow-small-left" : "fi fi-rr-circle-xmark"}
            style={{ fontSize: "20px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.1,
            letterSpacing: "-0.54px",
          }}
        >
          {t("Profile")}
        </Typography>
      </Stack> */}

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          backgroundColor: "background.default",
          px: "16px",
          py: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Clear, visible mobile marketplace navigation */}
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "14px",
            p: "14px",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: theme.palette.primary.deep || "text.primary",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              mb: 1.25,
            }}
          >
            {t("Marketplace")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "8px",
            }}
          >
            {MARKETPLACE_LINKS.map((item) => (
              <Box
                key={item.path}
                onClick={() => {
                  onClose?.();
                  router.push(item.path);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  px: "10px",
                  py: "10px",
                  borderRadius: "10px",
                  bgcolor: theme.palette.background.secondary || "#EFE7D3",
                  color: theme.palette.primary.deep || "#67513A",
                  cursor: "pointer",
                  "&:active": { opacity: 0.85 },
                }}
              >
                <i className={item.icon} style={{ fontSize: "15px", lineHeight: 1, display: "flex" }} />
                <Typography sx={{ fontSize: "12.5px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {t(item.label)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 700,
              color: theme.palette.primary.deep || "text.primary",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              mt: 1.75,
              mb: 1,
            }}
          >
            {t("Partners & Support")}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {PARTNER_SUPPORT_LINKS.map((item) => (
              <Chip
                key={item.path}
                label={t(item.label)}
                size="small"
                clickable
                onClick={() => {
                  onClose?.();
                  router.push(item.path);
                }}
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  bgcolor: theme.palette.primary.deep || "#67513A",
                  color: "#FFFFFF",
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Login/Signup intro card */}
        <Box
          sx={{
            backgroundColor: "background.secondary",
            borderRadius: "16px",
            pt: "24px",
            pb: "32px",
            px: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Stack spacing="6px" sx={{ width: "100%", px: "16px" }}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                color: "neutral.1050",
                lineHeight: 1.1,
                letterSpacing: "-0.6px",
                textAlign: "center",
              }}
            >
              {t("Login or Signup")}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 400,
                color: "neutral.500",
                lineHeight: 1.2,
                letterSpacing: "-0.42px",
                textAlign: "center",
              }}
            >
              {t(
                "To get more personalised & smooth experience please log in or sign up"
              )}
            </Typography>
          </Stack>
          <CustomButtonPrimary
            variant="contained"
            onClick={() => {
              onClose?.();
              onSignInClick?.();
            }}
            sx={{
              height: "40px",
              px: "16px",
              borderRadius: "12px",
              textTransform: "capitalize",
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.48px",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {t("Login/Signup")}
          </CustomButtonPrimary>
        </Box>

        {/* Menu panel */}
        <AccountMenuPanel
          bg="gray"
          token={token}
          onClose={onClose}
          onSignInClick={onSignInClick}
          cartListRefetch={cartListRefetch}
          hideLoginButton
        />
      </Box>
    </Drawer>
  );
};

export default ProfileDrawer;
