import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentDashboard } from "./studentThunk";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentState: (state) => {
      state.dashboardData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchStudentDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStudentState } = studentSlice.actions;
export default studentSlice.reducer;
