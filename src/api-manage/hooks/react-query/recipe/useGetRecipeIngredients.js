import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { recipe_ingredients_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async (recipeId) => {
  const { data } = await MainApi.get(`${recipe_ingredients_api}/${recipeId}`);
  return data;
};

export default function useGetRecipeIngredients(recipeId) {
  return useQuery(
    ["recipe-ingredients", recipeId],
    () => getData(recipeId),
    {
      enabled: false,
      onError: onSingleErrorResponse,
    }
  );
}
