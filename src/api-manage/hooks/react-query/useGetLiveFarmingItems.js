import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { useSelector } from "react-redux";
import { getCurrentModuleId } from "helper-functions/getCurrentModuleType";
import { getActiveCountry } from "helper-functions/marketZone";
import { getFarmingModule } from "utils/marketplaceNavigation";

const fetchLiveFarmingItems = async ({ status = "all", backyard = false, limit = 12, offset = 1, moduleId }) => {
  const params = new URLSearchParams({
    status,
    limit: String(limit),
    offset: String(offset),
  });
  if (backyard) {
    params.set("backyard", "1");
  }
  const { data } = await MainApi.get(`/api/v1/items/live-farming?${params.toString()}`, { headers: { moduleId } });
  return data;
};

export const useGetLiveFarmingItems = ({ status = "all", backyard = false, limit = 12, offset = 1, enabled = true } = {}) => {
  const selectedModule = useSelector(state => state.utilsData?.selectedModule?.id);
  const countryVersion = useSelector(state => state.configData?.countryCode);
  const moduleId = getFarmingModule(selectedModule ?? getCurrentModuleId());
  const country = getActiveCountry();
  let zone = null;
  try { zone = typeof window !== "undefined" ? localStorage.getItem("zoneid") : null; } catch {}
  return useQuery(
    ["live-farming-items", status, backyard, limit, offset, moduleId, country, countryVersion, zone],
    () => fetchLiveFarmingItems({ status, backyard, limit, offset, moduleId }),
    {
      enabled,
      staleTime: 60 * 1000,
    }
  );
};
