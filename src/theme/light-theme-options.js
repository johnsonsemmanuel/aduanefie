// Colors

const neutral = {
  90: "#FFFFFF1A",
  100: "#FFFFFF",
  200: "#E6DCC4",
  300: "#F5EFE0",
  400: "#B3A48D",
  450: "#A89880", // Figma: --sds-color-text-default-tertiary (placeholder)
  500: "#8A7A63",
  600: "#75644E",
  700: "#5E4E3B",
  800: "#4A3D2E",
  900: "#3A2F23",
  1000: "#67513A",
  1050: "#3A2F23", // Figma: --sds-color-text-default-default
  1100: "#D6D6D6",
};

const background = {
  default: "#F5EFE0", // cream page background
  paper: "#FFFFFF",
  secondary: "#EFE7D3", // Figma: --sds-color-background-default-secondary
  custom: "#F3ECDC",
  custom2: "#FFFFFF",
  custom3: "#F5EFE0",
  custom4: "#ffffff",
  footer1: "#9f9f9f1a",
  footer2: "#9f9f9f0d",
  custom5: "#F1E9D7",
  custom6: "#FAF7EF",
  custom7: "#F3ECDC",
};

const divider = "#E0D6BD";

const primary = {
  main: "#8B9F69",
  deep: "#67513A",
  light: "#E8E0C6",
  dark: "#4F3E2C",
  semiLight: "#E8E0C6",
  contrastText: "#FFFFFF",
  customType1: "#8B9F69",
  customType2: "#A3B585",
  customType3: "#C9D1B6",
  overLay: "#000000",
  lite: "rgba(139, 159, 105, 0.12)",
  icon: "#8B9F69",
};
const moduleTheme = {
  pharmacy: "#8B9F69",
  ecommerce: "#8B9F69",
  food: "#8B9F69",
  parcel: "#8B9F69",
};
const horizontalCardBG = "#E8E0C6";

const secondary = {
  main: "#67513A",
  light: "#8A7A63",
  dark: "#4F3E2C",
  contrastText: "#FFFFFF",
};

const success = {
  main: "#14B8A6",
  light: "#43C6B7",
  dark: "#0E8074",
  contrastText: "#FFFFFF",
};

const info = {
  main: "#2196F3",
  light: "#64B6F7",
  dark: "#0B79D0",
  lite: "#DBF5FF",
  tertiary: "#f1f6fd",
  contrastText: "#FFFFFF",
  contrastText1: "#F5F6F8",
  blue: "#0D6EFD",
  custom1: "#31C0F5",
};

const warning = {
  main: "#FFB020",
  light: "#FFF8D5",
  lite: "#FFBD8B",
  liter: "#FFF8F2",
  lighter: "#fffbeb",
  dark: "#FE961C",
  secondary: "#bf6a02",
  contrastText: "#FFFFFF",
  new: "#FFC817",
};

const error = {
  main: "#D14343",
  light: "#DA6868",
  dark: "#922E2E",
  contrastText: "#FFFFFF",
  deepLight: "#FF725E",
  // Figma danger tokens
  danger: "#ec221f", // background-danger-default (discount badge)
  dangerLight: "#fdd3d0", // background-danger-secondary (free delivery badge)
  dangerText: "#c00f0c", // text-danger-secondary
  red: "#f44336", // standard red (heart, trash icons)
};

const text = {
  primary: "#67513A",
  secondary: "#8A7A63",
  disabled: "rgba(103, 81, 58, 0.48)",
  custom: "#4A3D2E",
  customText1: "#6B5B47",
  info: "#3979E0",
  link: "#2A61BA",
};

const footer = {
  inputButton: "#E8E0C6",
  inputButtonHover: "#8B9F69",
  bottom: "rgba(103, 81, 58, 0.3)",
  foodBottom: "#686B78",
  appDownloadButtonBg: "#1A1A1A",
  appDownloadButtonBgGray: "#67513A",
  appDownloadButtonBgHover: "#4f4f4f",
  foodFooterBg: "#414141",
};
const customColor = {
  textGray: "#9c9c9c",
  textGrayDeep: "#787676",
  buyButton: "#F9E091",
  parcelWallet: "#8B3FFD",
  rebookIcon: "#6464EE",
  starAmber: "#F59E0B", // star/rating color
  vegGreen: "#4caf50", // veg indicator green
  vegIcon: "#71B63A", // veg SVG icon fill
  textNeutral: "#4A3D2E", // Figma text-neutral-default (item name)
  newBadge: "#e8b931", // "New" store badge bg (Figma warning)
  ratingCount: "#9C8E78", // rating review count color (Figma text-neutral-tertiary)
  deliveryText: "#6B5B47", // delivery info text (Figma text-neutral-secondary)
  tagBg: "#E6DCC4", // "+N" overflow badge, dividers (Figma background-default-tertiary)
  statusPendingBg: "#DBE9FF",
  statusPendingText: "#224A8A",
  statusReviewBg: "#CFF7D3",
  statusReviewText: "#009951",
  statusCancelledBg: "#FDF0DC",
  statusCancelledText: "#B5680A",
  proBannerBlueBg: "#3979E0",
};
const whiteContainer = {
  main: "#ffffff",
};
const pink = {
  main: "#FF6D76",
};
const foodCardColor = "#F7F0E1";
const paperBoxShadow = "#E6DCC4";
const couponBg = {
	pro: "#F1F6FD",
	discount: "#FFFBEB",
	ticket: "#FEE9E7",
};
const happyHourBanner = {
	bg: "#FEE9E7",
	timerBg: "#EC221F",
	timerColon: "#900B09",
	timerColonWarm: "#BF6A02",
};
const progressOffer = {
	bg: "#FFF1C2",
	track: "#FFFBEB",
	fill: "#BF6A02",
	chip: "#EC221F",
};
const bogoBanner = {
	bg: "#DBE9FF",
};
const roundStackOne = "rgba(255, 255, 255, 0.04)";
const roundStackTwo = "rgba(255, 255, 255, 0.06)";
const toolTipColor = neutral[1000];

export const lightThemeOptions = {
  components: {
    MuiUseMediaQuery: { defaultProps: { noSsr: true } }, // ⚡ Fix hydration
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[500],
          color: "#FFFFFF",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-filledDefault": {
            backgroundColor: neutral[200],
            "& .MuiChip-deleteIcon": {
              color: neutral[400],
            },
          },
          "&.MuiChip-outlinedDefault": {
            "& .MuiChip-deleteIcon": {
              color: neutral[300],
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          "&::placeholder": {
            opacity: 1,
            color: text.secondary,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: divider,
        },
        input: {
          "&:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px #f0f5f5 inset",
            "-webkit-text-fill-color": "#000",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderColor: divider,
          borderStyle: "solid",
          borderWidth: 1,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: neutral[500],
        },
        track: {
          backgroundColor: neutral[400],
          opacity: 1,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${divider}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: neutral[100],
          ".MuiTableCell-root": {
            color: neutral[700],
          },
        },
      },
    },
  },
  palette: {
    action: {
      active: neutral[500],
      focus: "rgba(55, 65, 81, 0.12)",
      hover: "rgba(55, 65, 81, 0.04)",
      selected: "rgba(55, 65, 81, 0.08)",
      disabledBackground: "rgba(55, 65, 81, 0.12)",
      disabled: "rgba(55, 65, 81, 0.26)",
    },
    horizontalCardBG,
    background,
    divider,
    error,
    info,
    mode: "light",
    neutral,
    primary,
    secondary,
    success,
    text,
    warning,
    footer,
    customColor,
    whiteContainer,
    pink,
    paperBoxShadow,
    foodCardColor,
    moduleTheme,
    roundStackOne,
    roundStackTwo,
    toolTipColor,
    couponBg,
    happyHourBanner,
    progressOffer,
    bogoBanner,
  },
  shadows: [
    "none",
    "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
    "0px 1px 2px rgba(100, 116, 139, 0.12)",
    "0px 1px 4px rgba(100, 116, 139, 0.12)",
    "0px 1px 5px rgba(100, 116, 139, 0.12)",
    "0px 1px 6px rgba(100, 116, 139, 0.12)",
    "0px 2px 6px rgba(100, 116, 139, 0.12)",
    "0px 3px 6px rgba(100, 116, 139, 0.12)",
    "0px 2px 4px rgba(31, 41, 55, 0.06), 0px 4px 6px rgba(100, 116, 139, 0.12)",
    "0px 5px 12px rgba(100, 116, 139, 0.12)",
    "0px 5px 14px rgba(100, 116, 139, 0.12)",
    "0px 5px 15px rgba(100, 116, 139, 0.12)",
    "0px 6px 15px rgba(100, 116, 139, 0.12)",
    "0px 7px 15px rgba(100, 116, 139, 0.12)",
    "0px 8px 15px rgba(100, 116, 139, 0.12)",
    "0px 9px 15px rgba(100, 116, 139, 0.12)",
    "0px 10px 15px rgba(100, 116, 139, 0.12)",
    "0px 12px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 13px 22px -8px rgba(100, 116, 139, 0.25)",
    "0px 14px 24px -8px rgba(100, 116, 139, 0.25)",
    "0px 10px 10px rgba(31, 41, 55, 0.04), 0px 20px 25px rgba(31, 41, 55, 0.1)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
    "0px 25px 50px rgba(100, 116, 139, 0.25)",
  ],
};
