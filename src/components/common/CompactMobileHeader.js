import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import ModeSwitcherTrigger from "components/module-select/ModeSwitcherTrigger";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { DESKTOP_LAYOUT_MEDIA_QUERY } from "utils/breakpoints";

/**
 * Shared mobile header for routes that had no header layer at all.
 *
 * Visually matches SimpleMobileHeader (back + title + compact mode switcher),
 * but the back target is explicit so detail pages return to their list rather
 * than dumping the user on /home. With no backHref it falls back to the
 * current module's home, which is safe on a direct page load.
 *
 * Hidden at the same 1180px cutoff as MobileNavBar and MainLayout.
 */
const CompactMobileHeader = ({ title, backHref, action, sx }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const moduleParam =
    typeof router.query.module === "string" ? router.query.module : undefined;

  const withModule = (href) => {
    if (!moduleParam || typeof href !== "string" || href.includes("?")) {
      return href;
    }
    return `${href}?module=${moduleParam}`;
  };

  const homeHref = moduleParam ? `/home?module=${moduleParam}` : "/home";
  const targetHref = backHref ? withModule(backHref) : homeHref;

  return (
    <Box
      sx={{
        display: "block",
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        backgroundColor: "background.paper",
        borderBottom: `1px solid ${theme.palette.divider}`,
        [`@media ${DESKTOP_LAYOUT_MEDIA_QUERY}`]: {
          display: "none",
        },
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap="8px"
        sx={{ px: "12px", py: "12px" }}
      >
        <IconButton
          onClick={() => router.push(targetHref)}
          aria-label={t("Back")}
          sx={{ p: "4px", color: "neutral.1050", flexShrink: 0 }}
        >
          <i
            className="fi fi-rr-arrow-small-left"
            style={{ fontSize: "22px", lineHeight: 1, display: "flex" }}
          />
        </IconButton>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 700,
            color: "neutral.1050",
            letterSpacing: "-0.54px",
            lineHeight: 1.1,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {t(title)}
        </Typography>
        <ModeSwitcherTrigger variant="compact" />
        {action}
      </Stack>
    </Box>
  );
};

export default CompactMobileHeader;
