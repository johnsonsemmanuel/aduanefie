import { useQuery } from "react-query";
import MainApi from "../../MainApi";
import { for_you_items_api } from "../../ApiRoutes";
import { getModuleId } from "helper-functions/getModuleId";
import { getToken } from "helper-functions/getToken";

const getForYouItems = async ({ limit = 12, offset = 1 } = {}) => {
  let recentIds = "";
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("recent_viewed_items") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        recentIds = stored.slice(0, 15).join(",");
      }
    } catch {
      // ignore malformed storage
    }
  }

  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (recentIds) {
    params.set("recent_ids", recentIds);
  }

  const { data } = await MainApi.get(`${for_you_items_api}?${params.toString()}`);
  return data;
};

export const useGetForYouItems = ({ limit = 12, offset = 1, enabled = true } = {}) => {
  const moduleId = getModuleId();
  const hasToken = Boolean(getToken());
  return useQuery(
    ["for-you-items", moduleId, hasToken, limit, offset],
    () => getForYouItems({ limit, offset }),
    {
      enabled: enabled && Boolean(moduleId),
      staleTime: 1000 * 60 * 3,
    }
  );
};
