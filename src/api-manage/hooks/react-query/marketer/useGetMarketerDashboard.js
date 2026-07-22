import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { marketer_dashboard_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async () => {
  const { data } = await MainApi.get(marketer_dashboard_api);
  return data;
};

export default function useGetMarketerDashboard() {
  return useQuery(["marketer-dashboard"], () => getData(), {
    onError: onSingleErrorResponse,
  });
}
