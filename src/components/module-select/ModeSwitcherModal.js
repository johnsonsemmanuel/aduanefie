import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { WHOLESALE_MODULE_ID } from "components/trade/tradeData";
import { filterOutRiderShareModules } from "helper-functions/moduleFilter";
import { setSelectedModule } from "redux/slices/utils";
import { getModuleIdentifier, saveModuleParam } from "utils/moduleParamManager";
import CustomModal from "components/modal";
import CustomImageContainer from "components/CustomImageContainer";
import StatusBadge from "components/common/StatusBadge";
import { zoneWiseModule } from "./ModuleSelect";

export const MODE_CHOSEN_STORAGE_KEY = "aduanefie_mode_chosen";

const getShortHint = (mod) => {
  const name = (mod?.module_name || "").toLowerCase();
  const type = mod?.module_type;

  if (String(mod?.id) === String(WHOLESALE_MODULE_ID) || name.includes("wholesale")) {
    return { tag: "B2B", hint: "Bulk produce & cross-border lots" };
  }
  if (name.includes("nearby") || name.includes("food market") || type === "grocery") {
    return { tag: "Local", hint: "Fresh food from nearby vendors" };
  }
  return { tag: null, hint: null };
};

const ModeSwitcherModal = ({ open, onClose, isGreeting = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
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

  const renderPrimaryCard = (mod) => {
    if (!mod) return null;
    const isActive = String(mod.id) === String(selectedModule?.id);
    const { tag, hint } = getShortHint(mod);

    return (
      <Grid item xs={12} sm={6} key={mod.id}>
        <Box
          onClick={() => handleSelectMode(mod)}
          sx={{
            cursor: "pointer",
            height: "100%",
            p: 2,
            borderRadius: "12px",
            bgcolor: isActive ? theme.palette.primary.lite : theme.palette.background.paper,
            border: "1.5px solid",
            borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
            transition: "border-color 0.15s ease, background-color 0.15s ease",
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: theme.palette.primary.lite,
            },
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                bgcolor: theme.palette.background.secondary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {mod?.icon_full_url && (
                <CustomImageContainer
                  src={mod.icon_full_url}
                  alt={mod.module_name}
                  width="32px"
                  height="32px"
                  objectFit="contain"
                />
              )}
            </Box>
            {isActive ? (
              <StatusBadge status="accepted" label={t("Active")} />
            ) : (
              tag && <StatusBadge status="returned" label={t(tag)} />
            )}
          </Stack>

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.3,
              mb: 0.4,
            }}
          >
            {mod.module_name}
          </Typography>
          {hint && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                display: "block",
                lineHeight: 1.4,
              }}
            >
              {t(hint)}
            </Typography>
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <CustomModal
      openModal={open}
      handleClose={handleCloseModal}
      closeButton
      maxWidth="620px"
    >
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2.5, sm: 3 }, pt: 0.5 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {isGreeting ? t("Choose Marketplace") : t("Switch Marketplace")}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mt: 0.25 }}
          >
            {t("Select how you want to browse Aduanefie.")}
          </Typography>
        </Box>

        {(wholesaleMod || nearbyMod) && (
          <Grid container spacing={1.5} sx={{ mb: secondaryMods.length > 0 ? 2 : 0 }}>
            {renderPrimaryCard(wholesaleMod)}
            {renderPrimaryCard(nearbyMod)}
          </Grid>
        )}

        {secondaryMods.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 600,
                color: theme.palette.text.secondary,
                mb: 1,
              }}
            >
              {t("More Marketplaces")}
            </Typography>
            <Grid container spacing={1.25}>
              {secondaryMods.map((mod) => {
                const isActive = String(mod.id) === String(selectedModule?.id);
                return (
                  <Grid item xs={12} sm={6} key={mod.id}>
                    <Box
                      onClick={() => handleSelectMode(mod)}
                      sx={{
                        cursor: "pointer",
                        p: 1.25,
                        borderRadius: "10px",
                        bgcolor: isActive
                          ? theme.palette.primary.lite
                          : theme.palette.background.paper,
                        border: "1px solid",
                        borderColor: isActive
                          ? theme.palette.primary.main
                          : theme.palette.divider,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        transition: "border-color 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          bgcolor: theme.palette.primary.lite,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          bgcolor: theme.palette.background.secondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden",
                        }}
                      >
                        {mod?.icon_full_url && (
                          <CustomImageContainer
                            src={mod.icon_full_url}
                            alt={mod.module_name}
                            width="26px"
                            height="26px"
                            objectFit="contain"
                          />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          minWidth: 0,
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {mod.module_name}
                      </Typography>
                      {isActive && <StatusBadge status="accepted" label={t("Active")} />}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Box>
    </CustomModal>
  );
};

export default ModeSwitcherModal;
