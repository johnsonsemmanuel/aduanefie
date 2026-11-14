import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";

const fetchLiveFarmingItems = async ({ status = "all", backyard = false, limit = 12, offset = 1 }) => {
  const params = new URLSearchParams({
    status,
    limit: String(limit),
    offset: String(offset),
  });
  if (backyard) {
    params.set("backyard", "1");
  }
  const { data } = await MainApi.get(`/api/v1/items/live-farming?${params.toString()}`);
  return data;
};

export const useGetLiveFarmingItems = ({ status = "all", backyard = false, limit = 12, offset = 1, enabled = true } = {}) => {
  return useQuery(
    ["live-farming-items", status, backyard, limit, offset],
    () => fetchLiveFarmingItems({ status, backyard, limit, offset }),
    {
      enabled,
      staleTime: 60 * 1000,
    }
  );
};
