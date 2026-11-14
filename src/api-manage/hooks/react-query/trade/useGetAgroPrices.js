import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";

const fetchAgroPrices = async ({ category = "all", marketHub = "all", search = "" } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (marketHub && marketHub !== "all") params.set("market_hub", marketHub);
  if (search) params.set("search", search);
  const qs = params.toString();
  const { data } = await MainApi.get(`/api/v1/trade/agro-prices${qs ? `?${qs}` : ""}`);
  return data;
};

export const useGetAgroPrices = ({ category = "all", marketHub = "all", search = "", enabled = true } = {}) => {
  return useQuery(
    ["ghana-agro-prices", category, marketHub, search],
    () => fetchAgroPrices({ category, marketHub, search }),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
    }
  );
};
