import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: null,
  referrals: [],
  payoutHistory: [],
  leaderboard: [],
};

export const marketerDataSlice = createSlice({
  name: "marketerData",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setReferrals: (state, action) => {
      state.referrals = action.payload;
    },
    setPayoutHistory: (state, action) => {
      state.payoutHistory = action.payload;
    },
    setLeaderboard: (state, action) => {
      state.leaderboard = action.payload;
    },
  },
});

export const {
  setDashboardData,
  setReferrals,
  setPayoutHistory,
  setLeaderboard,
} = marketerDataSlice.actions;
export default marketerDataSlice.reducer;
