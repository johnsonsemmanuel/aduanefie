import MainApi from "../../../MainApi";
import { organic_stores_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params) => {
  const { data } = await MainApi.get(organic_stores_api, { params });
  return data;
};

export default function useGetOrganicStores(params) {
  return useQuery(
    ["organic-stores", params],
    () => getData(params),
    {
      enabled: !!params?.zone_id,
      onError: onSingleErrorResponse,
    }
  );
}
