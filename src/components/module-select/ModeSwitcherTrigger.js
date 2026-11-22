import React, { useState } from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { isModuleAgnosticRoute } from "utils/moduleRoutes";
import ModeSwitcherModal from "./ModeSwitcherModal";

/**
 * One mode-switcher trigger for every header layer.
 *
 * variants:
 *   "mobile"  - two-line Market / active-module trigger used by MobileNavBar
 *   "desktop" - inline icon + label used by the desktop top bar
 *   "compact" - pill used by SimpleMobileHeader and CheckoutMobileHeader
 *
 * Availability and theming are identical everywhere: hidden on module-agnostic
 * routes and when no modules are loaded. Each instance owns its modal so no
 * header has to wire modal state itself.
 */
const ModeSwitcherTrigger = ({ variant = "mobile", sx }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { modules, selectedModule } = useSelector((state) => ({
    modules: state.configData.modules,
    selectedModule: state.utilsData.selectedModule,
  }));

  if (!modules || modules.length <= 1 || isModuleAgnosticRoute(router.pathname)) return null;

  const moduleName = selectedModule?.module_name || t("Choose Mode");
  const moduleIcon = selectedModule?.icon_full_url ? (
    <Box
      component="img"
      src={selectedModule.icon_full_url}
      alt=""
      sx={{
        width: variant === "compact" ? 16 : 18,
        height: variant === "compact" ? 16 : 18,
        objectFit: "contain",
        borderRadius: "4px",
        flexShrink: 0,
      }}
    />
  ) : (
    <SwapHorizIcon
      sx={{ fontSize: variant === "compact" ? 16 : 18, flexShrink: 0 }}
    />
  );

  if (variant === "desktop") {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          onClick={() => setOpen(true)}
          spacing={0.75}
          sx={{
            ml: "16px",
            pl: "16px",
            borderLeft: `1px solid ${theme.palette.divider}`,
            flexShrink: 0,
            maxWidth: "220px",
            cursor: "pointer",
            color: "neutral.1000",
            transition: "color 0.2s ease",
            "&:hover": { color: "primary.main" },
            ...sx,
          }}
        >
          {moduleIcon}
          <Typography
            noWrap
            sx={{ fontSize: { xs: "12px", sm: "15px" }, fontWeight: 500, color: "inherit" }}
          >
            {moduleName}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{ fontSize: { xs: "16px", sm: "20px" }, flexShrink: 0 }}
          />
        </Stack>
        <ModeSwitcherModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <Stack
          direction="row"
          alignItems="center"
          gap="4px"
          onClick={() => setOpen(true)}
          sx={{
            flexShrink: 0,
            maxWidth: "150px",
            px: "8px",
            py: "4px",
            borderRadius: "9999px",
            backgroundColor: "background.secondary",
            cursor: "pointer",
            color: "neutral.1050",
            transition: "background-color 0.2s ease",
            "&:hover": { backgroundColor: "primary.lite" },
            ...sx,
          }}
        >
          {moduleIcon}
          <Typography noWrap sx={{ fontSize: "12px", fontWeight: 600, color: "inherit" }}>
            {moduleName}
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: "16px", flexShrink: 0 }} />
        </Stack>
        <ModeSwitcherModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          flexShrink: 0,
          maxWidth: { xs: "120px", sm: "155px" },
          minWidth: 0,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "1px",
          ...sx,
        }}
      >
        <Stack direction="row" alignItems="center" gap="4px">
          <i
            className="fi fi-rr-apps"
            style={{
              fontSize: "12px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
            }}
          />
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              color: "neutral.1050",
              lineHeight: 1.15,
              letterSpacing: "-0.42px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t("Market")}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap="4px">
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 400,
              color: "text.secondary",
              lineHeight: 1.15,
              letterSpacing: "-0.36px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {moduleName}
          </Typography>
          <i
            className="fi fi-rr-angle-small-down"
            style={{
              fontSize: "16px",
              lineHeight: 1,
              display: "flex",
              color: theme.palette.neutral[1050],
              flexShrink: 0,
            }}
          />
        </Stack>
      </Box>
      <ModeSwitcherModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default React.memo(ModeSwitcherTrigger);
