import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetNearbyAggregationHubs from "api-manage/hooks/react-query/aggregation/useGetNearbyAggregationHubs";

const serviceLabels = (services) => {
  if (!Array.isArray(services)) return [];
  return services
    .map((service) =>
      typeof service === "string" ? service : service?.name ?? service?.label,
    )
    .filter(Boolean);
};

const NearbyAggregationHubs = ({ locationKey }) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const {
    country,
    location,
    zoneId,
    canFetch,
    data,
    isLoading,
    isError,
    error,
  } = useGetNearbyAggregationHubs(locationKey);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!country) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="warning" icon={false}>
          {t("Collection hubs are not available in your country yet.")}{" "}
          {t("Coming soon")}.
        </Alert>
      </Stack>
    );
  }

  if (!location || !zoneId) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="info" icon={false}>
          {t("Turn on location to find nearby collection hubs.")}
        </Alert>
      </Stack>
    );
  }

  if (isLoading) {
    return (
      <Stack spacing={1} sx={{ px: { xs: "16px", md: 0 } }}>
        <Skeleton variant="text" width="60%" height={28} />
        <Skeleton variant="rounded" height={96} />
        <Skeleton variant="rounded" height={96} />
      </Stack>
    );
  }

  const errorCode = error?.response?.data?.errors?.[0]?.code;
  if (isError) {
    const message =
      errorCode === "unsupported_country"
        ? `${t("Collection hubs are not available in your country yet.")} ${t("Coming soon")}.`
        : errorCode === "zoneId" || errorCode === "coordinates"
        ? t("Turn on location to find nearby collection hubs.")
        : t("We could not load collection hubs near you. Please try again.");

    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="warning" icon={false}>
          {message}
        </Alert>
      </Stack>
    );
  }

  const hubs = Array.isArray(data?.hubs) ? data.hubs : [];
  if (!hubs.length) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="info" icon={false}>
          {t("No collection hubs have been added near you yet.")}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.25} sx={{ px: { xs: "16px", md: 0 } }}>
      <Stack direction="row" alignItems="baseline" spacing={1} flexWrap="wrap">
        <Typography variant="subtitle1" fontWeight={700}>
          {t("Collection hubs near you")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("List view saves data on slow connections.")}
        </Typography>
      </Stack>

      {hubs.map((hub) => {
        const addressParts = [hub.address, hub.city, hub.region].filter(
          Boolean,
        );
        const services = serviceLabels(hub.services);
        const availableKg = Math.max(
          0,
          Number(hub.available_capacity_kg ?? 0),
        );

        return (
          <Card
            key={hub.id ?? hub.hub_code}
            variant="outlined"
            sx={{ borderRadius: "10px", bgcolor: "background.paper" }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack spacing={0.75}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  flexWrap="wrap"
                >
                  <Typography fontSize="14px" fontWeight={700}>
                    {hub.name || hub.hub_code || t("Collection hub")}
                  </Typography>
                  <Chip
                    size="small"
                    label={hub.status_label || hub.status || t("Active")}
                    color={hub.status === "active" ? "success" : "default"}
                  />
                </Stack>

                {addressParts.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {addressParts.join(", ")}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  {t("Available capacity")}: {availableKg.toLocaleString()} kg
                </Typography>

                {services.length > 0 && (
                  <Typography variant="caption" color="text.secondary">
                    {t("Services")}: {services.join(", ")}
                  </Typography>
                )}

                {hub.phone && (
                  <Typography
                    component="a"
                    href={`tel:${hub.phone}`}
                    variant="caption"
                    sx={{ color: "primary.main", textDecoration: "none" }}
                  >
                    {hub.phone}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
};

export default NearbyAggregationHubs;
