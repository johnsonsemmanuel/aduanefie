import MainApi from "../../../MainApi";
import { farm_updates_api } from "../../../ApiRoutes";
import { useQuery } from "react-query";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (storeId) => {
  if (!storeId) return null;
  const { data } = await MainApi.get(`${farm_updates_api}?store_id=${storeId}`);
  return data;
};

export default function useGetFarmUpdates(storeId) {
  return useQuery(
    ["farm-updates", storeId],
    () => getData(storeId),
    {
      enabled: !!storeId,
      onError: onSingleErrorResponse,
    }
  );
}
