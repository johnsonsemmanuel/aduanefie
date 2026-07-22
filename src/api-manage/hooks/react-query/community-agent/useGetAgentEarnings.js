import MainApi from "../../../MainApi";
import { agent_earnings_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params) => {
  const { data } = await MainApi.get(agent_earnings_api, { params });
  return data;
};

export default function useGetAgentEarnings(params) {
  return useQuery(
    ["agent-earnings", params],
    () => getData(params),
    {
      enabled: !!params?.agent_id,
      onError: onSingleErrorResponse,
    }
  );
}
