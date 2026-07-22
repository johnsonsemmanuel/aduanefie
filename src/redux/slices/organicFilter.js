import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cropType: null,
  zone: null,
  farmingMethod: null,
};

export const organicFilterSlice = createSlice({
  name: "organicFilter",
  initialState,
  reducers: {
    setCropType: (state, action) => {
      state.cropType = action.payload;
    },
    setZone: (state, action) => {
      state.zone = action.payload;
    },
    setFarmingMethod: (state, action) => {
      state.farmingMethod = action.payload;
    },
    resetOrganicFilter: (state) => {
      state.cropType = null;
      state.zone = null;
      state.farmingMethod = null;
    },
  },
});

export const {
  setCropType,
  setZone,
  setFarmingMethod,
  resetOrganicFilter,
} = organicFilterSlice.actions;
export default organicFilterSlice.reducer;
