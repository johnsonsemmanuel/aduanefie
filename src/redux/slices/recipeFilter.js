import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: null,
  selectedIngredients: [],
};

export const recipeFilterSlice = createSlice({
  name: "recipeFilter",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setSelectedIngredients: (state, action) => {
      state.selectedIngredients = action.payload;
    },
    toggleIngredient: (state, action) => {
      const exists = state.selectedIngredients.some(
        (ingredient) => ingredient.id === action.payload.id
      );
      if (exists) {
        state.selectedIngredients = state.selectedIngredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
      } else {
        state.selectedIngredients.push(action.payload);
      }
    },
    resetRecipeFilter: (state) => {
      state.category = null;
      state.selectedIngredients = [];
    },
  },
});

export const {
  setCategory,
  setSelectedIngredients,
  toggleIngredient,
  resetRecipeFilter,
} = recipeFilterSlice.actions;
export default recipeFilterSlice.reducer;
