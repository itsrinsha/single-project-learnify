import { createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardAPI } from "../../services/userService";

// Fetch student dashboard data
export const fetchStudentDashboard = createAsyncThunk(
  "student/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardAPI();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  }
);
