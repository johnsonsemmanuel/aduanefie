import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { aggregation_hubs_nearby } from "api-manage/ApiRoutes";
import { getActiveCountry } from "helper-functions/marketZone";
import { readCurrentLocation } from "helper-functions/validLocation";

const readStoredZoneId = () => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem("zoneid");
  if (!raw || raw === "undefined" || raw === "null") return null;

  try {
    const parsed = JSON.parse(raw);
    const isValid =
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every((id) => Number.isFinite(Number(id)) && Number(id) > 0);
    return isValid ? raw : null;
  } catch {
    return null;
  }
};

const readInputs = () => {
  if (typeof window === "undefined") {
    return { country: null, location: null, zoneId: null };
  }

  return {
    country: getActiveCountry(),
    location: readCurrentLocation(
      window.localStorage.getItem("currentLatLng"),
    ),
    zoneId: readStoredZoneId(),
  };
};

export default function useGetNearbyAggregationHubs(locationKey) {
  const { country, location, zoneId } = readInputs();
  const canFetch = Boolean(country && location && zoneId);

  const query = useQuery(
    [
      "nearby-aggregation-hubs",
      country ?? null,
      location?.lat ?? null,
      location?.lng ?? null,
      zoneId ?? null,
      locationKey ?? null,
    ],
    async () => {
      // Never call the endpoint for an unsupported country, an invalid point,
      // or a stale zone. The UI explains the missing input instead.
      if (!canFetch) return { hubs: [], total_size: 0 };

      const { data } = await MainApi.get(
        `${aggregation_hubs_nearby}?country_code=${encodeURIComponent(country)}`,
      );
      return data ?? {};
    },
    {
      enabled: canFetch,
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    },
  );

  return {
    ...query,
    country,
    location,
    zoneId,
    canFetch,
  };
}
