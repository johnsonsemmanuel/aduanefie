import React, { useMemo } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { WHOLESALE_MODULE_ID } from "components/trade/tradeData";
import { filterOutRiderShareModules } from "helper-functions/moduleFilter";
import { setSelectedModule } from "redux/slices/utils";
import { getModuleIdentifier, saveModuleParam } from "utils/moduleParamManager";
import { zoneWiseModule } from "./ModuleSelect";

const EARTH_DARK = "#4F3E2C";
const EARTH_ACCENT = "#67513A";
const OLIVE_GREEN = "#8B9F69";
const EARTH_BORDER = "#E0D6BD";
const WARM_SAND = "#EFE7D3";
const CANVAS = "#FAF8F5";

export const MODE_CHOSEN_STORAGE_KEY = "aduanefie_mode_chosen";

const getModuleCopy = (mod) => {
  const name = (mod?.module_name || "").toLowerCase();
  const type = mod?.module_type;

  if (String(mod?.id) === String(WHOLESALE_MODULE_ID) || name.includes("wholesale")) {
    return {
      badge: "B2B Commodity & Export",
      subtitle:
        "Source bulk grains, produce, livestock & cross-border container lots from verified suppliers.",
      cta: "Browse Wholesale B2B",
    };
  }
  if (name.includes("nearby") || name.includes("food market") || type === "grocery") {
    return {
      badge: "Everyday Retail Market",
      subtitle:
        "Shop fresh vegetables, poultry, tubers & farm staples from food vendors around your location.",
      cta: "Shop Nearby Market",
    };
  }
  if (type === "service") {
    return {
      badge: "Mechanization & Contractors",
      subtitle:
        "Book tractor hiring, spraying teams, soil testing & on-farm agricultural specialists.",
      cta: "Explore Services",
    };
  }
  if (type === "ecommerce") {
    return {
      badge: "Tools & Machinery",
      subtitle: "Compare farm machinery, irrigation equipment, storage gear & hardware.",
      cta: "Browse Equipment",
    };
  }
  if (type === "pharmacy") {
    return {
      badge: "Agro-Inputs & Vet Care",
      subtitle: "Order certified fertilisers, seeds, crop protection & livestock medicines.",
      cta: "Browse Farm Inputs",
    };
  }
  if (type === "parcel") {
    return {
      badge: "Freight & Dispatch",
      subtitle: "Arrange agricultural haulage and point-to-point farm produce delivery.",
      cta: "Book Freight",
    };
  }
  return {
    badge: "Specialized Mode",
    subtitle: "Explore suppliers and listings curated for this marketplace mode.",
    cta: "Open Mode",
  };
};

const ModeSwitcherModal = ({ open, onClose, isGreeting = false }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);
  const { selectedModule } = useSelector((state) => state.utilsData);

  const availableModules = useMemo(() => {
    const zoned = zoneWiseModule(modules);
    if (zoned && zoned.length > 0) return zoned;
    return filterOutRiderShareModules(modules) || [];
  }, [modules]);

  const { wholesaleMod, nearbyMod, secondaryMods } = useMemo(() => {
    const wholesale = availableModules.find(
      (m) =>
        String(m?.id) === String(WHOLESALE_MODULE_ID) ||
        /wholesale/i.test(m?.module_name || "")
    );
    const nearby = availableModules.find(
      (m) =>
        m?.id !== wholesale?.id &&
        (/nearby|food market/i.test(m?.module_name || "") || m?.module_type === "grocery")
    );
    const featuredIds = new Set([wholesale?.id, nearby?.id].filter(Boolean));
    const secondary = availableModules.filter((m) => !featuredIds.has(m?.id));
    return { wholesaleMod: wholesale, nearbyMod: nearby, secondaryMods: secondary };
  }, [availableModules]);

  const handleCloseModal = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(MODE_CHOSEN_STORAGE_KEY, "1");
    }
    onClose?.();
  };

  const handleSelectMode = (mod) => {
    if (!mod) return;
    if (typeof window !== "undefined") {
      localStorage.setItem(MODE_CHOSEN_STORAGE_KEY, "1");
      localStorage.setItem("module", JSON.stringify(mod));
    }
    dispatch(setSelectedModule(mod));
    const moduleIdentifier = getModuleIdentifier(mod);
    saveModuleParam(mod?.id, mod?.slug);
    onClose?.();

    const isOnHome = router.pathname === "/home";
    router.push(
      { pathname: "/home", query: { module: moduleIdentifier } },
      undefined,
      { shallow: isOnHome }
    );
  };

  const renderPrimaryCard = (mod, variant) => {
    if (!mod) return null;
    const isWholesale = variant === "wholesale";
    const isActive = String(mod.id) === String(selectedModule?.id);
    const copy = getModuleCopy(mod);

    return (
      <Card
        key={mod.id}
        elevation={0}
        onClick={() => handleSelectMode(mod)}
        sx={{
          cursor: "pointer",
          height: "100%",
          borderRadius: "16px",
          p: { xs: 2.2, sm: 2.8 },
          bgcolor: isWholesale ? EARTH_DARK : WARM_SAND,
          color: isWholesale ? "#FFFFFF" : EARTH_DARK,
          border: isActive
            ? `2px solid ${OLIVE_GREEN}`
            : `1px solid ${isWholesale ? EARTH_ACCENT : EARTH_BORDER}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.15s ease, border-color 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            borderColor: OLIVE_GREEN,
          },
        }}
      >
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
            <Chip
              size="small"
              icon={
                isWholesale ? (
                  <Inventory2OutlinedIcon sx={{ fontSize: 15, color: "#FFFFFF !important" }} />
                ) : (
                  <StorefrontOutlinedIcon sx={{ fontSize: 15, color: `${EARTH_DARK} !important` }} />
                )
              }
              label={t(copy.badge)}
              sx={{
                bgcolor: isWholesale ? EARTH_ACCENT : "#FFFFFF",
                color: isWholesale ? "#FAF8F5" : EARTH_DARK,
                fontWeight: 700,
              }}
            />
            {isActive && (
              <Chip
                size="small"
                icon={<CheckCircleIcon sx={{ fontSize: 14, color: "#FFFFFF !important" }} />}
                label={t("Active")}
                sx={{ bgcolor: OLIVE_GREEN, color: "#FFFFFF", fontWeight: 700 }}
              />
            )}
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            {mod?.icon_full_url && (
              <Box
                component="img"
                src={mod.icon_full_url}
                alt={mod.module_name}
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  objectFit: "cover",
                  bgcolor: "#FFFFFF",
                  p: 0.4,
                }}
              />
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.05rem", sm: "1.2rem" },
                color: isWholesale ? "#FAF8F5" : EARTH_DARK,
              }}
            >
              {mod.module_name}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: isWholesale ? "#EFE7D3" : "#5E5042",
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            {t(copy.subtitle)}
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: isWholesale ? OLIVE_GREEN : EARTH_DARK,
            color: "#FFFFFF",
            fontWeight: 700,
            borderRadius: "10px",
            py: 1,
            "&:hover": {
              bgcolor: isWholesale ? "#778B56" : EARTH_ACCENT,
            },
          }}
        >
          {t(copy.cta)}
        </Button>
      </Card>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "22px",
          bgcolor: CANVAS,
          border: `1px solid ${EARTH_BORDER}`,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
          sx={{ mb: 2.5 }}
        >
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <SwapHorizIcon sx={{ color: OLIVE_GREEN, fontSize: 22 }} />
              <Typography variant="overline" sx={{ color: EARTH_ACCENT, fontWeight: 700 }}>
                {isGreeting
                  ? t("Welcome to Aduanefie")
                  : t("Switch Marketplace Mode")}
              </Typography>
            </Stack>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: EARTH_DARK,
                fontSize: { xs: "1.25rem", sm: "1.55rem" },
              }}
            >
              {isGreeting
                ? t("How would you like to trade or shop today?")
                : t("Choose what Aduanefie shows you")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
              {t(
                "Pick Wholesale B2B commodities, Nearby Food Market, or jump straight to inputs, equipment, or agro services."
              )}
            </Typography>
          </Box>

          <IconButton
            onClick={handleCloseModal}
            aria-label={t("Close")}
            sx={{ bgcolor: WARM_SAND, color: EARTH_DARK, "&:hover": { bgcolor: EARTH_BORDER } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>

        {/* Primary Decision: Wholesale B2B vs Nearby Food Market */}
        {(wholesaleMod || nearbyMod) && (
          <Grid container spacing={2} sx={{ mb: secondaryMods.length ? 3 : 0 }}>
            {wholesaleMod && (
              <Grid item xs={12} sm={nearbyMod ? 6 : 12}>
                {renderPrimaryCard(wholesaleMod, "wholesale")}
              </Grid>
            )}
            {nearbyMod && (
              <Grid item xs={12} sm={wholesaleMod ? 6 : 12}>
                {renderPrimaryCard(nearbyMod, "nearby")}
              </Grid>
            )}
          </Grid>
        )}

        {/* Secondary Specialized Agritech Modes */}
        {secondaryMods.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: EARTH_ACCENT, mb: 1.5 }}
            >
              {t("Or explore specialized agricultural marketplaces")}
            </Typography>
            <Grid container spacing={1.5}>
              {secondaryMods.map((mod) => {
                const isActive = String(mod.id) === String(selectedModule?.id);
                const copy = getModuleCopy(mod);
                return (
                  <Grid item xs={12} sm={6} key={mod.id}>
                    <Card
                      elevation={0}
                      onClick={() => handleSelectMode(mod)}
                      sx={{
                        cursor: "pointer",
                        p: 1.8,
                        borderRadius: "14px",
                        bgcolor: "#FFFFFF",
                        border: isActive
                          ? `2px solid ${OLIVE_GREEN}`
                          : `1px solid ${EARTH_BORDER}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        transition: "border-color 0.15s ease",
                        "&:hover": { borderColor: OLIVE_GREEN },
                      }}
                    >
                      {mod?.icon_full_url && (
                        <Box
                          component="img"
                          src={mod.icon_full_url}
                          alt={mod.module_name}
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "10px",
                            objectFit: "cover",
                            bgcolor: WARM_SAND,
                            p: 0.5,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color={EARTH_DARK}
                            noWrap
                          >
                            {mod.module_name}
                          </Typography>
                          {isActive && (
                            <CheckCircleIcon sx={{ fontSize: 16, color: OLIVE_GREEN }} />
                          )}
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          {t(copy.subtitle)}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModeSwitcherModal;
