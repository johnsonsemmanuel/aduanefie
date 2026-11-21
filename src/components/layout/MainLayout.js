import { Box, useMediaQuery, useTheme } from "@mui/material";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { ModuleTypes } from "helper-functions/moduleTypes";
import useScrollDirection from "hooks/useScrollDirection";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { setModules } from "../../redux/slices/configData";
import { setSelectedModule } from "../../redux/slices/utils";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import FooterComponent from "../footer";
import HeaderComponent from "../header";
import BottomNav from "../header/BottomNav";
import { MainLayoutRoot } from "./LandingLayout";

// import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
// import { ModuleTypes } from "helper-functions/moduleTypes";
import SearchProductModal from "../home/search/SearchProductModal";
// import { MainLayoutRoot } from "./LandingLayout";
import FloatingCartButton from "../header/new-navbar/FloatingCartButton";
import HappyHourBanner from "../happy-hour/HappyHourBanner";
import NetworkStatusBanner from "./NetworkStatusBanner";
import ScrollToTopFab from "./ScrollToTopFab";
import { DESKTOP_LAYOUT_MEDIA_QUERY, MOBILE_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";
import {
  MOBILE_BOTTOM_NAV_HEIGHT,
  shouldShowMobileBottomNav,
} from "utils/mobileBottomNav";

const HAPPY_HOUR_FLOATING_ROUTES = new Set(["/home"]);

const RENTAL_COMPACT_DESKTOP_HEADER_ROUTES = new Set([
  "/rental/checkout",
  "/rental/cart",
  "/rental/trip-status/[id]",
  "/rental/vehicle/[id]",
  "/rental/provider/[id]",
  "/rental/vehicle-search",
]);

// Routes that own their own sticky/in-flow header on mobile (no extra mt needed).
// Adding a route here removes the default mobile navbar offset on that page.
const FULL_BLEED_MOBILE_ROUTES = new Set([
  "/search",
  "/profile",
  "/store/[id]",
  "/all-stores",
  "/checkout",
  "/refund-policy",
  "/cancellation-policy",
  "/shipping-policy",
  "/privacy-policy",
  "/track-order",
  "/store-registration",
  "/deliveryman-registration",
  "/help-and-support",
  "/about-us",
  // Trade (B2B) pages use SimpleMobileHeader instead of the module header
  "/trade",
  "/trade/blocs",
  "/trade/blocs/[slug]",
  "/market-prices",
  "/live-farming",
  "/regional-tours",
  "/become-a-marketer",
  "/group-buys",
  "/group-buys/[id]",
  // Section + category pages use their own MobileNavBar variant
  "/home/[...slug]",
  "/home/category/[slug]",
  "/home/wishlist",
  "/campaigns",
  "/campaigns/[id]",
  "/product/[id]",
  "/parcel-delivery-info",
  "/rental/vehicle-search",
  "/rental/checkout",
  "/rental/cart",
  "/rental/vehicle/[id]",
  "/rental/provider/latest",
  "/rental/provider/popular",
  "/rental/provider/[id]",
  "/rental/trip-status/[id]",
  "/service/service-details/[id]",
  "/service/provider/[id]",
  "/service/checkout",
  "/service/checkout/custom-service",
  "/service/custom-service/create",
  "/service/custom-service/details/[id]",
  "/service/all-providers",
]);

// Constant per route/module - sized for the EXPANDED header. The scroll-away
// collapse is a pure transform on the fixed AppBar (see NavBar.style.js) and
// never changes layout, so the content offset must not react to it either.
//
// These values are intentionally NOT uniform: each module renders a different
// set of header rows (address, module tabs, search bar, section chips), so the
// offset has to match that module's real header height. Only the FULL_BLEED
// routes share a single value because they render their own in-flow header.
const getMobileMarginTop = ({ pathname, currentModuleType }) => {
  if (FULL_BLEED_MOBILE_ROUTES.has(pathname)) return "0px";
  // BOGO list & details render only the compact address + cart header on
  // mobile (no module tabs, search bar or section chips), so they need a much
  // smaller offset than the home header's default 7.6rem - otherwise a large
  // empty gap appears above the content.
  if (pathname === "/bogo-list" || pathname === "/bogo-list/[id]") {
    return "3.25rem";
  }
  if (currentModuleType === ModuleTypes.RIDE) return "4.9rem";
  if (currentModuleType === ModuleTypes.RENTAL) {
    return pathname?.startsWith("/rental") ? "3rem" : "6.3rem";
  }
  if (currentModuleType === ModuleTypes.PARCEL) return "5.4rem";
  return "7.6rem";
};

// Info/legal routes where the full footer is appropriate even on mobile.
const MOBILE_FOOTER_ROUTES = new Set([
  "/about-us",
  "/privacy-policy",
  "/terms-and-conditions",
  "/refund-policy",
  "/shipping-policy",
  "/cancellation-policy",
  "/help-and-support",
]);

// Transactional / focused routes where the footer is distracting even on desktop.
const HIDDEN_DESKTOP_FOOTER_ROUTES = new Set([
  "/checkout",
  "/profile",
  "/track-order",
  "/track-order/[id]",
  "/group-buys/[id]",
  "/rental/checkout",
  "/rental/cart",
  "/service/checkout",
  "/service/checkout/[slug]",
  "/service/checkout/custom-service",
]);

const shouldShowFooter = ({ pathname, isSmall }) => {
  if (isSmall) return MOBILE_FOOTER_ROUTES.has(pathname);
  return !HIDDEN_DESKTOP_FOOTER_ROUTES.has(pathname);
};

const MainLayout = ({ children, configData, onHappyHourActiveChange }) => {
  const [rerenderUi, setRerenderUi] = useState(false);
  const { data, refetch } = useGetModule();
  const theme = useTheme();
  const isSmall = useMediaQuery(MOBILE_LAYOUT_MEDIA_QUERY);
  const router = useRouter();
  const { page } = router.query;
  // Shared with the footer so it reserves clearance only when the nav exists.
  const showBottomNav = shouldShowMobileBottomNav({
    pathname: router.pathname,
    page,
  });
  const dispatch = useDispatch();
  const [happyHourActive, setHappyHourActive] = useState(false);
  const isHappyHourRoute = HAPPY_HOUR_FLOATING_ROUTES.has(router.pathname);
  const handleHappyHourActiveChange = useCallback(
    (active) => {
      setHappyHourActive(active);
      onHappyHourActiveChange?.(active);
    },
    [onHappyHourActiveChange],
  );
  useEffect(() => {
    // `configData.modules` is redux-persist-blacklisted, so a hard reload of
    // any of these routes starts with an empty module list - and since it's
    // only ever dispatched from the query below, the navbar's module tab bar
    // stays hidden (`renderModuleBar` bails on `!modules?.length`) unless we
    // explicitly refetch here too, not just on /home.
    if (
      router.pathname === "/home" ||
      router.pathname === "/bogo-list" ||
      router.pathname === "/bogo-list/[id]" ||
      router.pathname === "/search"
    ) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (data?.length) {
      dispatch(setModules(data));
    }
  }, [data]);
  // if (data) {
  // 	const selectedModuleType = JSON.parse(
  // 		localStorage.getItem("module")
  // 	)?.module_type;
  // 	if (data.length === 0) {
  // 		localStorage.removeItem("module");
  // 		router.push("/", undefined, { shallow: true });
  // 	} else {
  // 		if (
  // 			!data?.find((item) => item.module_type === selectedModuleType)
  // 		) {
  // 			const newModule = data[0];
  // 			localStorage.setItem("module", JSON.stringify(newModule));
  // 			dispatch(setSelectedModule(newModule));
  // 			if (router.isReady) {
  // 				const nextQuery = {
  // 					...router.query,
  // 					module_id: `${newModule.id}`,
  // 				};
  // 				if (router.query.module_id !== `${newModule.id}`) {
  // 					router.replace(
  // 						{ pathname: router.pathname, query: nextQuery },
  // 						undefined,
  // 						{ shallow: true }
  // 					);
  // 				}
  // 			}
  // 		}
  // 	}
  // }
  const selectedModule = useSelector(
    (state) => state.utilsData?.selectedModule,
  );
  const queryModuleType =
    typeof router.query.module === "string" ? router.query.module : null;
  const currentModuleType =
    selectedModule?.module_type ??
    getCurrentModuleType() ??
    queryModuleType ??
    null;
  // ── Cross-tab module sync ──
  // The active module is shared across the whole browser (localStorage "module").
  // When another tab switches modules the `storage` event fires here, so this tab
  // mirrors the change: update redux + replace the URL's module param. Every open
  // tab stays on the same module (data + URL) instead of drifting out of sync.
  useEffect(() => {
    const handleModuleStorage = (e) => {
      if (e.key !== "module" || !e.newValue) return;
      let nextModule;
      try {
        nextModule = JSON.parse(e.newValue);
      } catch {
        return;
      }
      if (!nextModule?.id) return;
      dispatch(setSelectedModule(nextModule));
      // Only rewrite the URL on module-aware pages (those that carry ?module=).
      const identifier = nextModule.slug || nextModule.id;
      if (
        router.query.module !== undefined &&
        String(router.query.module) !== String(identifier)
      ) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, module: identifier },
          },
          undefined,
          { shallow: true },
        );
      }
    };
    window.addEventListener("storage", handleModuleStorage);
    return () => window.removeEventListener("storage", handleModuleStorage);
  }, [router, dispatch]);

  // Mirrors NewNavBar's renderModuleBar condition.
  const hasDesktopModuleBar =
    router.pathname === "/home" ||
    router.pathname?.startsWith("/home/") ||
    router.pathname?.startsWith("/search");

  const showFooter = shouldShowFooter({
    pathname: router.pathname,
    isSmall,
  });

  return (
    <MainLayoutRoot justifyContent="space-between" key={rerenderUi}>
      <header>
        <HeaderComponent />
      </header>
      <CustomStackFullWidth
        sx={{
          // Keep the mobile offset for the whole range where MobileNavBar
          // renders (up to MOBILE_LAYOUT_BREAKPOINT = 1180px). The old `md`
          // key switched at the theme's 1000px, leaving 1000-1180px with a
          // desktop offset under a still-mobile header.
          marginTop: getMobileMarginTop({
            pathname: router.pathname,
            currentModuleType,
          }),
          paddingBottom:
            isSmall && showBottomNav && !showFooter
              ? `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom, 0px) + 16px)`
              : 0,
          [`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]: {
            marginTop: RENTAL_COMPACT_DESKTOP_HEADER_ROUTES.has(router.pathname)
              ? "5.4rem"
              : router.pathname?.startsWith("/rental")
              ? "10rem"
              : hasDesktopModuleBar
              ? "5.4rem"
              : "4rem",
          },
          // Declared after the desktop rule so it wins at >= 1240px.
          [theme.breakpoints.up("lg")]: {
            marginTop: RENTAL_COMPACT_DESKTOP_HEADER_ROUTES.has(router.pathname)
              ? "5.4rem"
              : router.pathname?.startsWith("/rental")
              ? "10rem"
              : hasDesktopModuleBar
              ? "6.4rem"
              : "4rem",
          },
        }}
      >
        {/* Reserve viewport height while content is still fetching so the
            footer stays below the fold on mobile reload instead of flashing up
            into an empty (auto-height) content area. */}
        <CustomStackFullWidth sx={{ minHeight: { xs: "70dvh", md: "70vh" } }}>
          {children}
        </CustomStackFullWidth>
      </CustomStackFullWidth>
      {showFooter && (
        <footer>
          <FooterComponent configData={configData} />
        </footer>
      )}
      {isHappyHourRoute && (
        <Box
          sx={{
            display: happyHourActive ? "block" : "none",
            [`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]: {
              display: "none",
            },
            position: "fixed",
            bottom: `${MOBILE_BOTTOM_NAV_HEIGHT}px`,
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 1081,
          }}
        >
          <HappyHourBanner
            compact
            onActiveChange={handleHappyHourActiveChange}
          />
        </Box>
      )}
      {isSmall && showBottomNav && <BottomNav />}
      <NetworkStatusBanner />
      <ScrollToTopFab hasBottomNav={Boolean(isSmall && showBottomNav)} />
      <SearchProductModal />
      <FloatingCartButton />
    </MainLayoutRoot>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
  onHappyHourActiveChange: PropTypes.func,
};

export default React.memo(MainLayout);
