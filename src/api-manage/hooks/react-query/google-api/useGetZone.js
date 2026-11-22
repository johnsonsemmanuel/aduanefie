import { useQuery } from "react-query";
import { zoneId_api } from "../../../ApiRoutes";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "../../../api-error-response/ErrorResponses";
import MainApi from "../../../MainApi";
import { getApiContent } from "../../../getApiContent";
import { store } from "redux/store";
import { mergeZoneData } from "redux/slices/zoneData";
import { getActiveCountry } from "helper-functions/marketZone";

const getZoneId = async (location) => {
  // A coordinate is only meaningful together with a market. Never resolve a
  // zone for an unknown/unsupported country, which would fall back to Ghana.
  const countryCode = getActiveCountry();
  if (location?.lat && location?.lng && countryCode) {
    const { data } = await MainApi.get(
      `${zoneId_api}?lat=${location.lat}&lng=${location.lng}&country_code=${countryCode}`,
    );
    const content = getApiContent(data);
    store.dispatch(mergeZoneData(content?.zone_data));
    return content;
  }
};

export default function useGetZoneId(location, zoneIdEnabled) {
  const countryCode = getActiveCountry();
  return useQuery(
    ["zoneId", location, countryCode],
    () => getZoneId(location),
    {
      enabled: zoneIdEnabled && Boolean(countryCode),
      //onError: onErrorResponse,
      retry: 0,
    },
  );
}
