import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  isLoading: false,
};

export const savedRecipesSlice = createSlice({
  name: "savedRecipes",
  initialState,
  reducers: {
    setSavedRecipes: (state, action) => {
      state.list = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addSavedRecipe: (state, action) => {
      state.list.push(action.payload);
    },
    removeSavedRecipe: (state, action) => {
      state.list = state.list.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  setSavedRecipes,
  setIsLoading,
  addSavedRecipe,
  removeSavedRecipe,
} = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
