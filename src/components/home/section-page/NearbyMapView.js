import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Alert, Skeleton, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import useGetNearbyAggregationHubs from "api-manage/hooks/react-query/aggregation/useGetNearbyAggregationHubs";

const NearbyGoogleMap = dynamic(() => import("./NearbyGoogleMap"), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" height={320} />,
});

const toCoordinate = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isValidPoint = (point) =>
  point.lat !== null &&
  point.lng !== null &&
  point.lat >= -90 &&
  point.lat <= 90 &&
  point.lng >= -180 &&
  point.lng <= 180 &&
  !(point.lat === 0 && point.lng === 0);

const NearbyMapView = ({ stores = [], items = [], locationKey }) => {
  const { t } = useTranslation();
  const { country, location, data, isLoading, isError } =
    useGetNearbyAggregationHubs(locationKey);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

  const points = useMemo(() => {
    const seen = new Set();
    const collected = [];
    const add = (point) => {
      if (!isValidPoint(point)) return;
      const key = `${point.lat.toFixed(4)}:${point.lng.toFixed(4)}:${point.label}`;
      if (seen.has(key)) return;
      seen.add(key);
      collected.push(point);
    };

    stores.forEach((store) => {
      add({
        id: `store-${store?.id ?? store?.name ?? collected.length}`,
        kind: "store",
        label: store?.name || t("Store"),
        detail: [store?.address, store?.city].filter(Boolean).join(", "),
        lat: toCoordinate(store?.latitude),
        lng: toCoordinate(store?.longitude),
      });
    });

    items.forEach((item, index) => {
      const store = item?.store ?? item?.store_info ?? {};
      add({
        id: `item-${item?.id ?? index}`,
        kind: "item",
        label: item?.name || t("Nearby item"),
        detail: store?.name || "",
        lat: toCoordinate(store?.latitude ?? item?.latitude),
        lng: toCoordinate(store?.longitude ?? item?.longitude),
      });
    });

    (Array.isArray(data?.hubs) ? data.hubs : []).forEach((hub) => {
      add({
        id: `hub-${hub?.id ?? hub?.hub_code ?? collected.length}`,
        kind: "hub",
        label: hub?.name || hub?.hub_code || t("Collection hub"),
        detail: [hub?.address, hub?.city].filter(Boolean).join(", "),
        lat: toCoordinate(hub?.latitude),
        lng: toCoordinate(hub?.longitude),
      });
    });

    return collected.slice(0, 30);
  }, [stores, items, data?.hubs, t]);

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

  if (!location) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="info" icon={false}>
          {t("Turn on location to unlock map view.")}
        </Alert>
      </Stack>
    );
  }

  if (!apiKey) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="info" icon={false}>
          {t("Map view is unavailable on this deployment. Use List view.")}
        </Alert>
      </Stack>
    );
  }

  if (isLoading) {
    return <Skeleton variant="rounded" height={320} />;
  }

  if (isError) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="warning" icon={false}>
          {t("We could not load map points. Use List view instead.")}
        </Alert>
      </Stack>
    );
  }

  if (!points.length) {
    return (
      <Stack sx={{ px: { xs: "16px", md: 0 } }}>
        <Alert severity="info" icon={false}>
          {t("No nearby places have map positions yet. Use List view.")}
        </Alert>
      </Stack>
    );
  }

  const center = location
    ? { lat: location.lat, lng: location.lng }
    : { lat: points[0].lat, lng: points[0].lng };

  return (
    <Stack spacing={1} sx={{ px: { xs: "16px", md: 0 } }}>
      <Typography variant="caption" color="text.secondary">
        {t("Map view loads only after you open it. Switch to List for low data use.")}
      </Typography>
      <NearbyGoogleMap points={points} center={center} />
    </Stack>
  );
};

export default NearbyMapView;
