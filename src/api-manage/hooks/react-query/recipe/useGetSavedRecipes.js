import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { saved_recipes_list_api } from "../../../ApiRoutes";
import { onSingleErrorResponse } from "../../../api-error-response/ErrorResponses";

const getData = async () => {
  const { data } = await MainApi.get(saved_recipes_list_api);
  return data;
};

export default function useGetSavedRecipes() {
  return useQuery(["saved-recipes"], () => getData(), {
    onError: onSingleErrorResponse,
  });
}
