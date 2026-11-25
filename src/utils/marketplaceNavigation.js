// Shop owns shopping; Live owns growing and backyard discovery.
export const normalizeMarketplaceModule = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const id = String(raw).trim();
  return /^[1-9]\d*$/.test(id) ? id : null;
};

export const getMarketplaceHref = (requested, saved) =>
  `/home?module=${normalizeMarketplaceModule(requested) || normalizeMarketplaceModule(saved) || "2"}`;

export const isLiveRoute = (pathname = "") =>
  pathname === "/live" || pathname === "/farms" || pathname.startsWith("/farms/") || pathname === "/live-farming";

export const isMarketplaceRoute = (pathname = "") =>
  pathname === "/home" || pathname.startsWith("/home/") ||
  pathname === "/search" || pathname === "/store" || pathname.startsWith("/store/") ||
  pathname === "/all-stores" || pathname === "/all-brands";

// Farm crops belong to produce markets, even when the shopper last browsed equipment/services.
export const getFarmingModule = (value) => {
  const id = normalizeMarketplaceModule(value);
  return id === "1" || id === "2" ? id : "2";
};

export const PRIMARY_NAV_ITEMS = [
  { key: "home", label: "Home", icon: "fi fi-rr-home", path: "/" },
  { key: "shop", label: "Shop", icon: "fi fi-rr-shop", openMarketplace: true },
  { key: "live", label: "Live", icon: "fi fi-rr-leaf", path: "/live" },
  { key: "profile", label: "Profile", icon: "fi fi-rr-user", openProfile: true },
];
