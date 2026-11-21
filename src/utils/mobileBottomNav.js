// Single source of truth for the fixed mobile bottom nav's geometry and
// visibility. MainLayout decides whether to render the nav; the footer needs
// the same answer to reserve clearance, so both call shouldShowMobileBottomNav.

// Keep in sync with the Box height in components/header/BottomNav.js.
export const MOBILE_BOTTOM_NAV_HEIGHT = 65;

// Routes that own their own full-width bottom area, or whose layout must not
// be covered by the fixed nav.
const HIDDEN_BOTTOM_NAV_ROUTES = new Set([
  "/store/[id]",
  "/product/[id]",
  "/service/provider/[id]",
  "/service/service-details/[id]",
]);

export const shouldShowMobileBottomNav = ({ pathname, page }) => {
  // The parcel checkout flow uses its own bottom action bar.
  if (page === "parcel") return false;
  return !HIDDEN_BOTTOM_NAV_ROUTES.has(pathname);
};
