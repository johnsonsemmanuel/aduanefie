import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { cross_border_countries_api } from "api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

// `cross-border/countries` answers `{ data: [...] }` rather than the v4.2
// envelope, so `getApiContent` hands the body back untouched and the rows sit
// one level down. Unwrap them here so callers deal in a plain array.
const getCountries = async () => {
  const { data } = await MainApi.get(cross_border_countries_api);
  const content = getApiContent(data);
  return content?.data ?? [];
};

export default function useGetCountries(options = {}) {
  return useQuery(["cross-border-countries"], getCountries, {
    // The reference list changes only when an admin edits it.
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
}
