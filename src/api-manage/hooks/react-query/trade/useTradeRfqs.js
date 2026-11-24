import { useMutation, useQuery, useQueryClient } from "react-query";
import MainApi from "api-manage/MainApi";

export const useGetTradeRfqs = (status = "all") => {
  return useQuery(["trade-rfqs", status], async () => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    const { data } = await MainApi.get(`/api/v1/trade/requests?${params.toString()}`);
    return data;
  });
};

export const useCreateTradeRfq = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const { data } = await MainApi.post("/api/v1/trade/rfqs", payload);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trade-rfqs"]);
      },
    }
  );
};

export const useSubmitRfqQuote = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ rfqId, payload }) => {
      const { data } = await MainApi.post(`/api/v1/trade/rfqs/${rfqId}/quotes`, payload);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trade-rfqs"]);
      },
    }
  );
};

export const useAcceptRfqQuote = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ rfqId, quoteId }) => {
      const { data } = await MainApi.post(`/api/v1/trade/rfqs/${rfqId}/quotes/${quoteId}/accept`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["trade-rfqs"]);
      },
    }
  );
};
