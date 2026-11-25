import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Box, NoSsr, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { toast } from "react-hot-toast";
import { getToken } from "helper-functions/getToken";
import WishListCardView from "../wishlist";
import ProfileDrawer from "./ProfileDrawer";
import NextImage from "components/NextImage";
import { DESKTOP_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";
import { MOBILE_BOTTOM_NAV_HEIGHT } from "utils/mobileBottomNav";

const AuthModal = dynamic(() => import("components/auth/AuthModal"));

const NAV_ITEMS = [
  {
    key: "home",
    label: "Home",
    icon: "fi fi-rr-home",
    path: "/",
  },
  {
    key: "nearby",
    label: "Nearby",
    icon: "fi fi-rr-marker",
    path: "/home/nearby",
    keepModuleQuery: true,
  },
  {
    key: "orders",
    label: "Orders",
    icon: "fi fi-rr-receipt",
    path: "/profile?page=my-orders",
    requireAuth: true,
  },
  {
    key: "profile",
    label: "Account",
    icon: "fi fi-rr-user",
    openProfile: true,
  },
];

const BottomNav = () => {
  const router = useRouter();
  const theme = useTheme();
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const currentModuleType =
    selectedModule?.module_type ?? getCurrentModuleType();
  const [wishListOpen, setWishListOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [modalFor, setModalFor] = useState("sign-in");

  const isNearbyRoute = () => {
    const asPath = router.asPath.split(/[?#]/)[0];
    if (router.pathname === "/home/nearby" || asPath === "/home/nearby") {
      return true;
    }
    const slug = router.query?.slug;
    const firstSegment = Array.isArray(slug) ? slug[0] : slug;
    return (
      router.pathname === "/home/[...slug]" && firstSegment === "nearby"
    );
  };

  const isActive = (item) => {
    if (item.key === "home") {
      return (
        router.pathname === "/" ||
        router.pathname === "/home" ||
        (router.pathname.startsWith("/home/") &&
          router.pathname !== "/home/wishlist" &&
          !isNearbyRoute())
      );
    }
    if (item.key === "nearby") {
      return isNearbyRoute();
    }
    if (item.openWishlist) {
      return router.pathname === "/home/wishlist";
    }
    if (item.openProfile) {
      const page = router.query?.page;
      return (
        router.pathname === "/profile" &&
        (!page || page === "profile-settings" || page === "addresses")
      );
    }
    if (!item.path) return false;
    const [pathname, search] = item.path.split("?");
    if (search) {
      const params = new URLSearchParams(search);
      return (
        router.pathname === pathname &&
        [...params.entries()].every(([k, v]) => router.query[k] === v)
      );
    }
    return router.pathname.startsWith(pathname);
  };

  const handleClick = (item) => {
    if (item.openProfile) {
      if (getToken()) {
        router.push("/profile");
      } else {
        setProfileOpen(true);
      }
      return;
    }
    if (item.requireAuth && !getToken()) {
      toast.error(t("Please login"));
      setAuthOpen(true);
      return;
    }
    if (item.openWishlist) {
      router.push({
        pathname: "/home/wishlist",
        query: router.query.module ? { module: router.query.module } : {},
      });
      return;
    }
    if (item.keepModuleQuery && router.query.module) {
      router.push({
        pathname: item.path,
        query: { module: router.query.module },
      });
      return;
    }
    if (item.path) router.push(item.path);
  };

  return (
    <NoSsr>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: "0px -2px 8px rgba(0,0,0,0.06)",
          zIndex: 1082,
          display: "flex",
          [`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]: {
            display: "none",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="stretch"
          justifyContent="space-around"
          gap="2px"
          sx={{ flex: 1, width: "100%", px: "4px" }}
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            const color = active ? theme.palette.primary.main : "#757575";

            return (
              <Stack
                key={item.key}
                onClick={() => handleClick(item)}
                alignItems="center"
                justifyContent="center"
                gap={"4px"}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: `${MOBILE_BOTTOM_NAV_HEIGHT}px`,
                  pt: "6px",
                  pb: "6px",
                  px: "4px",
                  cursor: "pointer",
                  userSelect: "none",
                  position: "relative",
                }}
              >
                {/* Active indicator pill */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    width: active ? 28 : 0,
                    height: 3,
                    borderRadius: "0 0 3px 3px",
                    backgroundColor: theme.palette.primary.main,
                    transition: "width 0.2s ease",
                  }}
                />
                {item.key === "profile" && profileInfo?.image_full_url ? (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "9999px",
                      overflow: "hidden",
                      outline: active
                        ? `2px solid ${theme.palette.primary.main}`
                        : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NextImage
                      src={profileInfo.image_full_url}
                      alt={profileInfo.image_full_url}
                      width={20}
                      height={20}
                      objectFit="cover"
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={item.icon}
                      style={{
                        fontSize: "20px",
                        lineHeight: 1,
                        display: "flex",
                        color,
                      }}
                    />
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: active ? 700 : 500,
                    lineHeight: 1.15,
                    letterSpacing: "-0.2px",
                    color,
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                >
                  {t(item.label)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Box>

      {wishListOpen && (
        <WishListCardView
          sideDrawerOpen={wishListOpen}
          setSideDrawerOpen={setWishListOpen}
        />
      )}

      <ProfileDrawer
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSignInClick={() => setAuthOpen(true)}
      />

      {authOpen && (
        <AuthModal
          open={authOpen}
          handleClose={() => {
            setAuthOpen(false);
            setModalFor("sign-in");
          }}
          modalFor={modalFor}
          setModalFor={setModalFor}
        />
      )}
    </NoSsr>
  );
};

export default React.memo(BottomNav);
