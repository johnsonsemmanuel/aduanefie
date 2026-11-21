// Single source of truth for the app's mobile/tablet layout cutoff.
//
// The header shell, the navbar that it renders, the page layout padding and
// the bottom nav all switch at the same width. They previously disagreed
// (theme.breakpoints.down("md") = 1000px in the shell vs 1180px in the
// navbar), so between 1000-1180px the mobile bar rendered without its
// scroll-collapse behavior. Keep every consumer on this constant.
export const MOBILE_LAYOUT_BREAKPOINT = 1180;

export const MOBILE_LAYOUT_MEDIA_QUERY = `(max-width:${MOBILE_LAYOUT_BREAKPOINT}px)`;

// Complement used by styles that must only apply on desktop. The 0.01px gap
// mirrors the original `(min-width:1180.01px)` rule so the two never overlap.
export const DESKTOP_LAYOUT_MEDIA_QUERY = `(min-width:${
  MOBILE_LAYOUT_BREAKPOINT + 0.01
}px)`;
