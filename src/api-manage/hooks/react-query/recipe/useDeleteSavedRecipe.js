import { useMutation } from "react-query";

import MainApi from "../../../MainApi";
import { remove_saved_recipe_api } from "../../../ApiRoutes";

const removeRecipe = async (recipeId) => {
  const { data } = await MainApi.delete(`${remove_saved_recipe_api}/${recipeId}`);
  return data;
};

export default function useDeleteSavedRecipe() {
  return useMutation((recipeId) => removeRecipe(recipeId));
}
