import { useQuery } from "react-query";
import MainApi from "../../../MainApi";
import {
  trade_bloc_detail_api,
  trade_blocs_api,
  trade_corridors_by_bloc_api,
} from "../../../ApiRoutes";
import { findFallbackBloc, TRADE_API_ENABLED } from "components/trade/tradeData";

// Trade endpoints are read-only and optional in phase one: while the trade
// service is not deployed, the queries stay disabled so they don't 404 on
// every page view. Set NEXT_PUBLIC_TRADE_API_ENABLED=true once the backend
// ships; until then the seeded fallback copy is shown instead.
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
  useQuery(["trade-blocs"], getBlocs, {
    ...TRADE_QUERY_OPTIONS,
    enabled: TRADE_API_ENABLED,
  });

const getBloc = async (slug) => {
  const { data } = await MainApi.get(trade_bloc_detail_api(slug));
  return data?.bloc ?? null;
};

export const useTradeBloc = (slug) =>
  useQuery(["trade-bloc", slug], () => getBloc(slug), {
    ...TRADE_QUERY_OPTIONS,
    enabled: TRADE_API_ENABLED && Boolean(slug),
  });

const getBlocCorridors = async (slug) => {
  const { data } = await MainApi.get(trade_corridors_by_bloc_api(slug));
  return Array.isArray(data?.corridors) ? data.corridors : [];
};

export const useTradeBlocCorridors = (slug) =>
  useQuery(["trade-bloc-corridors", slug], () => getBlocCorridors(slug), {
    ...TRADE_QUERY_OPTIONS,
    enabled: TRADE_API_ENABLED && Boolean(slug),
  });

export const useTradeBlocWithFallback = (slug) => {
  const query = useTradeBloc(slug);
  return {
    ...query,
    bloc: query.data ?? findFallbackBloc(slug),
  };
};
