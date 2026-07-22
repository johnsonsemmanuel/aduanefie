import { useMutation } from "react-query";

import MainApi from "../../../MainApi";
import { save_recipe_api } from "../../../ApiRoutes";

const saveRecipe = async (payload) => {
  const { data } = await MainApi.post(save_recipe_api, payload);
  return data;
};

export default function usePostSaveRecipe() {
  return useMutation((payload) => saveRecipe(payload));
}
