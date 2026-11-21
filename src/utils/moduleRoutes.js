// Routes that are not tied to a product module. They never carry ?module=,
// so the mode switcher is hidden on them too (see ModuleChecker, which skips
// URL sync on these routes for the same reason).
export const isModuleAgnosticRoute = (pathname) =>
  pathname === "/welcome" ||
  pathname === "/trade" ||
  pathname?.startsWith("/trade/");
