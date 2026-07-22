import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { marketer_leaderboard_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async () => {
  const { data } = await MainApi.get(marketer_leaderboard_api);
  return data;
};

export default function useGetMarketerLeaderboard() {
  return useQuery(["marketer-leaderboard"], () => getData(), {
    onError: onSingleErrorResponse,
  });
}
