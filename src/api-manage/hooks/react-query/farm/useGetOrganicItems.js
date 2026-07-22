import MainApi from "../../../MainApi";
import { organic_items_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params) => {
  const { data } = await MainApi.get(organic_items_api, { params });
  return data;
};

export default function useGetOrganicItems(params) {
  return useQuery(
    ["organic-items", params],
    () => getData(params),
    {
      enabled: !!params?.zone_id,
      onError: onSingleErrorResponse,
    }
  );
}
