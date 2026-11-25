import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import MainApi from "api-manage/MainApi";
import { isBackgroundQueryEnabled } from "utils/featureFlags";

const fetchAgroPrices = async ({ category = "all", marketHub = "all", search = "" } = {}) => {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (marketHub && marketHub !== "all") params.set("market_hub", marketHub);
  if (search) params.set("search", search);
  const qs = params.toString();
  const { data } = await MainApi.get(`/api/v1/trade/agro-prices${qs ? `?${qs}` : ""}`);
  return data;
};

export const useGetAgroPrices = ({ category = "all", marketHub = "all", search = "", enabled } = {}) => {
  const configData = useSelector((state) => state.configData?.configData);
  const effectiveEnabled =
    typeof enabled === "boolean"
      ? enabled
      : isBackgroundQueryEnabled(
          configData,
          "agro_prices",
          process.env.NEXT_PUBLIC_ENABLE_AGRO === "true"
        );
  return useQuery(
    ["ghana-agro-prices", category, marketHub, search],
    () => fetchAgroPrices({ category, marketHub, search }),
    {
      enabled: effectiveEnabled,
      staleTime: 5 * 60 * 1000,
    }
  );
};
