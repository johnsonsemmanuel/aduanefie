import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";

const FALLBACK_FX = {
  base: "GHS",
  rates: { GHS: 1, USD: 0.068, NGN: 108, XOF: 41.5, KES: 8.8, ZAR: 1.24 },
  symbols: { GHS: "GH₵", USD: "$", NGN: "₦", XOF: "CFA ", KES: "KSh ", ZAR: "R" },
};

export const useGetFxRates = () => {
  return useQuery(
    ["trade-fx-rates"],
    async () => {
      try {
        const { data } = await MainApi.get("/api/v1/trade/fx-rates");
        return data?.rates ? data : FALLBACK_FX;
      } catch {
        return FALLBACK_FX;
      }
    },
    { staleTime: 1000 * 60 * 30 }
  );
};
