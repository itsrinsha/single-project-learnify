import { createAsyncThunk } from "@reduxjs/toolkit";
import instructorService from "../../services/instructorService";

export const fetchInstructorDashboard = createAsyncThunk(
  "instructor/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await instructorService.getInstructorDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch instructor dashboard");
    }
  }
);
export const fetchInstructorStudents = createAsyncThunk(
  "instructor/fetchStudents",
  async (_, { rejectWithValue }) => {
    try {
      const data = await instructorService.getInstructorStudents();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch instructor students");
    }
  }
);

export const fetchReviewHistory = createAsyncThunk(
  "instructor/fetchReviewHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instructorService.getReviewHistory();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch review history");
    }
  }
);
