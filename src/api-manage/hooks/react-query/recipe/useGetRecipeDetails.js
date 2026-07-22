import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { recipe_detail_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (recipeId) => {
  const { data } = await MainApi.get(`${recipe_detail_api}/${recipeId}`);
  return data;
};

export default function useGetRecipeDetails(recipeId) {
  return useQuery(
    ["recipe-details", recipeId],
    () => getData(recipeId),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
