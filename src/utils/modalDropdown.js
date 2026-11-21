// CustomModal pins its paper at z-index 1500. MUI portals Select menus and
// Autocomplete poppers to document.body at the theme default (1300), so they
// render behind the sheet. Keep every dropdown inside a modal above it.

export const MODAL_SELECT_MENU_PROPS = {
  sx: { zIndex: 1600 },
  PaperProps: { sx: { zIndex: 1600 } },
};

export const MODAL_POPPER_PROPS = {
  sx: { zIndex: 1700 },
};
