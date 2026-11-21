import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";

// Currency symbols are static presentation data, not a rate. Rates must come
// from the API — a hard-coded "fallback rate" would be shown as if it were
// current when the trade service is down.
const CURRENCY_SYMBOLS = {
  GHS: "GH₵",
  USD: "$",
  NGN: "₦",
  XOF: "CFA ",
  KES: "KSh ",
  ZAR: "R",
};

export const useGetFxRates = () => {
  return useQuery(
    ["trade-fx-rates"],
    async () => {
      const { data } = await MainApi.get("/api/v1/trade/fx-rates");
      if (!data?.rates) {
        throw new Error("Live exchange rates are not available");
      }
      return {
        ...data,
        symbols: { ...CURRENCY_SYMBOLS, ...(data.symbols || {}) },
      };
    },
    { staleTime: 1000 * 60 * 30, retry: false }
  );
};
