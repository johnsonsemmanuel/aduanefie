import { useMutation, useQuery, useQueryClient } from "react-query";
import MainApi from "api-manage/MainApi";
import { getGuestId, getToken } from "helper-functions/getToken";
import {
  group_buys_api,
  group_buys_my_api,
  group_buy_detail_api,
  group_buy_join_api,
  group_buy_leave_api,
  group_buy_cancel_api,
  group_buy_quote_api,
} from "api-manage/ApiRoutes";

const identity = () =>
  getToken() ? {} : { guest_id: getGuestId() || `guest_${Date.now()}` };

export const useGetGroupBuys = ({ status = "all", country, moduleId, enabled = true } = {}) =>
  useQuery(
    ["group-buys", status, country, moduleId],
    async () => {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      if (country) params.set("country", country);
      if (moduleId) params.set("module_id", moduleId);
      const qs = params.toString();
      const { data } = await MainApi.get(`${group_buys_api}${qs ? `?${qs}` : ""}`);
      return data;
    },
    { enabled, staleTime: 30 * 1000 }
  );

export const useGetGroupBuy = (id, enabled = true) =>
  useQuery(
    ["group-buy", id],
    async () => {
      const { data } = await MainApi.get(group_buy_detail_api(id), {
        params: identity(),
      });
      return data?.data;
    },
    { enabled: Boolean(id) && enabled, staleTime: 30 * 1000 }
  );

export const useGetMyGroupBuys = (enabled = true) =>
  useQuery(
    ["group-buys", "my"],
    async () => {
      const { data } = await MainApi.get(group_buys_my_api, { params: identity() });
      return data?.data;
    },
    { enabled, staleTime: 30 * 1000 }
  );

export const useCreateGroupBuy = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const { data } = await MainApi.post(group_buys_api, payload);
      return data?.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("group-buys");
        queryClient.invalidateQueries("group-buy");
      },
    }
  );
};

const groupAction = (urlBuilder, invalidate = true) => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, payload = {} }) => {
      const { data } = await MainApi.post(urlBuilder(id), {
        ...identity(),
        ...payload,
      });
      return data?.data;
    },
    {
      onSuccess: () => {
        if (invalidate) {
          queryClient.invalidateQueries("group-buys");
          queryClient.invalidateQueries("group-buy");
        }
      },
    }
  );
};

export const useJoinGroupBuy = () => groupAction(group_buy_join_api);
export const useLeaveGroupBuy = () => groupAction(group_buy_leave_api);
export const useCancelGroupBuy = () => groupAction(group_buy_cancel_api);

export const useGetGroupBuyQuote = (id, destinationCountry, enabled = true) =>
  useQuery(
    ["group-buy", id, "quote", destinationCountry],
    async () => {
      const { data } = await MainApi.post(group_buy_quote_api(id), {
        destination_country: destinationCountry,
      });
      return data?.data;
    },
    { enabled: Boolean(id && destinationCountry) && enabled, staleTime: 60 * 1000 }
  );
