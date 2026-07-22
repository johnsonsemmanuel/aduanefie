import MainApi from "../../../MainApi";
import { farm_input_products_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params) => {
  const { data } = await MainApi.get(farm_input_products_api, { params });
  return data;
};

export default function useGetFarmInputProducts(params) {
  return useQuery(
    ["farm-input-products", params],
    () => getData(params),
    {
      enabled: !!params?.zone_id,
      onError: onSingleErrorResponse,
    }
  );
}
