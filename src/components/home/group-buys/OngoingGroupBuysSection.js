import React from "react";
import Link from "next/link";
import { Button, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import GroupBuyCard from "components/group-buy/GroupBuyCard";
import { useGetGroupBuys } from "api-manage/hooks/react-query/group-buy/useGroupBuys";

const INCOMPATIBLE_MODULE_TYPES = new Set(["parcel", "rental", "service", "food", "pharmacy"]);

/**
 * Marketplace discovery strip for open groups. It only renders when the module
 * is compatible (physical goods with bulk/group-buy suppliers) and has real data,
 * so incompatible or retail-only modules do not get a dead section.
 */
const OngoingGroupBuysSection = ({ moduleId, limit = 6 }) => {
  const { t } = useTranslation();
  const selectedModule = useSelector((state) => state.utilsData?.selectedModule);
  const moduleType = String(selectedModule?.module_type || "").toLowerCase();
  const isModuleTypeCompatible = !moduleType || !INCOMPATIBLE_MODULE_TYPES.has(moduleType);

  const { data, isLoading, isError, refetch } = useGetGroupBuys({
    status: "open",
    moduleId,
    enabled: Boolean(moduleId) && isModuleTypeCompatible,
  });
  const groups = data?.data?.data || [];

  if (!moduleId || !isModuleTypeCompatible) return null;
  if (data?.module_supported === false) return null;
  if (!isLoading && !isError && groups.length === 0) return null;

  const visible = groups.slice(0, limit);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography
          sx={{
            fontSize: { xs: 20, sm: 24 },
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {t("Ongoing group buys")}
        </Typography>
        <Button
          component={Link}
          href={moduleId ? `/group-buys?module_id=${moduleId}` : "/group-buys"}
          size="small"
          sx={{ whiteSpace: "nowrap", textTransform: "none", fontWeight: 600 }}
        >
          {t("View all")}
        </Button>
      </Stack>

      {isError && groups.length === 0 ? (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            {t("Ongoing groups could not be loaded right now.")}
          </Typography>
          <Button size="small" onClick={() => refetch()}>
            {t("Retry")}
          </Button>
        </Stack>
      ) : (
        <Grid container spacing={{ xs: 1.25, sm: 2 }}>
          {isLoading
            ? [...Array(4)].map((_, index) => (
                <Grid item xs={6} sm={6} md={4} key={`skeleton-${index}`}>
                  <Skeleton variant="rounded" height={220} sx={{ borderRadius: "12px" }} />
                </Grid>
              ))
            : visible.map((group) => (
                <Grid item xs={6} sm={6} md={4} key={group.id}>
                  <GroupBuyCard group={group} />
                </Grid>
              ))}
        </Grid>
      )}
    </Stack>
  );
};

export default OngoingGroupBuysSection;
