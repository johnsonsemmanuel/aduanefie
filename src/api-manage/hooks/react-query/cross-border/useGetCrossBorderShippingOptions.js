import { useQuery } from "react-query";
import MainApi from "api-manage/MainApi";
import { cross_border_shipping_options_api } from "api-manage/ApiRoutes";
import { getApiContent } from "api-manage/getApiContent";

// Routes (not prices) are what the client sends: the server resolves each
// item's catalogue price, HS code and billable weight itself, then returns the
// lanes actually configured for the origin/destination pair. Anything it cannot
// price — no lane, no FX rate, no customs rule — is simply absent from
// `options`, so a zero here is a hard "do not offer this", never a free quote.
const getShippingOptions = async (payload) => {
  const { data } = await MainApi.post(
    cross_border_shipping_options_api,
    payload,
  );
  return getApiContent(data)?.data;
};

export default function useGetCrossBorderShippingOptions(payload, enabled) {
  const lines = payload?.lines ?? [];
  const quotable =
    Boolean(enabled) &&
    Boolean(payload?.store_id) &&
    Boolean(payload?.destination_country) &&
    lines.length > 0 &&
    lines.every((line) => line?.item_id && line?.quantity > 0);

  return useQuery(
    ["cross-border-shipping-options", payload],
    () => getShippingOptions(payload),
    {
      enabled: quotable,
      // Keeps the previously quoted lanes on screen while the cart changes,
      // instead of collapsing the selector to a loading state.
      keepPreviousData: true,
      retry: false,
      refetchOnWindowFocus: false,
      onError: () => {},
    },
  );
}
