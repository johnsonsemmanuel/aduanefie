// Routes that are not tied to a product module. They never carry ?module=,
// so the mode switcher is hidden on them too (see ModuleChecker, which skips
// URL sync on these routes for the same reason).
export const isModuleAgnosticRoute = (pathname) =>
  !pathname ||
  pathname === "/" ||
  pathname === "/404" ||
  pathname === "/500" ||
  pathname === "/app-redirect" ||
  pathname === "/maintainance" ||
  pathname === "/forgot-password" ||
  pathname === "/welcome" ||
  pathname === "/trade" ||
  pathname?.startsWith("/trade/") ||
  pathname === "/market-prices" ||
  pathname === "/group-buys" ||
  pathname?.startsWith("/group-buys/") ||
  pathname === "/live-farming" ||
  pathname === "/regional-tours" ||
  pathname === "/become-a-marketer" ||
  pathname === "/store-registration" ||
  pathname === "/deliveryman-registration" ||
  pathname === "/profile" ||
  pathname?.startsWith("/profile/") ||
  pathname === "/interest" ||
  pathname === "/checkout" ||
  pathname?.startsWith("/checkout/") ||
  pathname?.startsWith("/track-order") ||
  pathname === "/help-and-support" ||
  pathname === "/about-us" ||
  pathname === "/privacy-policy" ||
  pathname === "/terms-and-conditions" ||
  pathname === "/refund-policy" ||
  pathname === "/cancellation-policy" ||
  pathname === "/shipping-policy" ||
  pathname?.startsWith("/product/") ||
  pathname?.startsWith("/store/");
