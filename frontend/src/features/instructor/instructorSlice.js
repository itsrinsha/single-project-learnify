import { createSlice } from "@reduxjs/toolkit";
import { fetchInstructorDashboard, fetchInstructorStudents, fetchReviewHistory } from "./instructorThunk";

const initialState = {
  dashboardData: null,
  students: [],
  reviewHistory: [],
  loading: false,
  error: null,
};

const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    clearInstructorState: (state) => {
      state.dashboardData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchInstructorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInstructorStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.students;
      })
      .addCase(fetchInstructorStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReviewHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewHistory = action.payload.history || [];
      })
      .addCase(fetchReviewHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInstructorState } = instructorSlice.actions;
export default instructorSlice.reducer;
