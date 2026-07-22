import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { recipe_list_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (params) => {
  const { data } = await MainApi.get(recipe_list_api, { params });
  return data;
};

export default function useGetRecipes(params) {
  return useQuery(
    ["recipes", params],
    () => getData(params),
    {
      onError: onSingleErrorResponse,
    }
  );
}
