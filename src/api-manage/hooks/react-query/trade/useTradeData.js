import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import {
  trade_bloc_detail_api,
  trade_blocs_api,
  trade_corridors_by_bloc_api,
} from "../../../ApiRoutes";
import { findFallbackBloc } from "components/trade/tradeData";

// Trade endpoints are read-only and optional in phase one: while the trade
// service is not deployed some of them answer 404. Fail fast (no retry storm)
// and let the pages fall back to the seeded bloc copy instead of blocking.
const TRADE_QUERY_OPTIONS = {
  retry: 0,
  refetchOnWindowFocus: false,
  staleTime: 1000 * 60 * 10,
};

const getBlocs = async () => {
  const { data } = await MainApi.get(trade_blocs_api);
  return Array.isArray(data?.blocs) ? data.blocs : [];
};

export const useTradeBlocs = () =>
  useQuery(["trade-blocs"], getBlocs, TRADE_QUERY_OPTIONS);

const getBloc = async (slug) => {
  const { data } = await MainApi.get(trade_bloc_detail_api(slug));
  return data?.bloc ?? null;
};

export const useTradeBloc = (slug) =>
  useQuery(["trade-bloc", slug], () => getBloc(slug), {
    ...TRADE_QUERY_OPTIONS,
    enabled: Boolean(slug),
  });

const getBlocCorridors = async (slug) => {
  const { data } = await MainApi.get(trade_corridors_by_bloc_api(slug));
  return Array.isArray(data?.corridors) ? data.corridors : [];
};

export const useTradeBlocCorridors = (slug) =>
  useQuery(["trade-bloc-corridors", slug], () => getBlocCorridors(slug), {
    ...TRADE_QUERY_OPTIONS,
    enabled: Boolean(slug),
  });

export const useTradeBlocWithFallback = (slug) => {
  const query = useTradeBloc(slug);
  return {
    ...query,
    bloc: query.data ?? findFallbackBloc(slug),
  };
};
