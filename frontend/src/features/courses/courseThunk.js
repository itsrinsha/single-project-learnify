import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllCourses,
  getFeaturedCourses,
  getCourseById,
  getEnrolledCourses,
  enrollCourse,
  getCourseReviews,
  submitCourseReview,
  getCourseLessons,
  createCourse,
  updateCourse,
} from "./courseApi";
import paymentService from "../../services/paymentService";
const { verifyPayment: verifyPaymentAPI } = paymentService;

// Fetch all courses
export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async (filters, { rejectWithValue }) => {
    try {
      return await getAllCourses(filters);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch courses");
    }
  }
);

// Fetch featured courses
export const fetchFeaturedCourses = createAsyncThunk(
  "courses/fetchFeatured",
  async (limit, { rejectWithValue }) => {
    try {
      return await getFeaturedCourses(limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch featured courses");
    }
  }
);

// Fetch course by ID
export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (courseId, { rejectWithValue }) => {
    try {
      return await getCourseById(courseId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch course details");
    }
  }
);

// Fetch enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolled",
  async (_, { rejectWithValue }) => {
    try {
      return await getEnrolledCourses();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch enrolled courses");
    }
  }
);

// Enroll in a course
export const enrollInCourse = createAsyncThunk(
  "courses/enroll",
  async (courseId, { rejectWithValue }) => {
    try {
      return await enrollCourse(courseId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Enrollment failed");
    }
  }
);

// Fetch course reviews
export const fetchCourseReviews = createAsyncThunk(
  "courses/fetchReviews",
  async (courseId, { rejectWithValue }) => {
    try {
      return await getCourseReviews(courseId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);

// Submit course review
export const submitReview = createAsyncThunk(
  "courses/submitReview",
  async ({ courseId, reviewData }, { rejectWithValue }) => {
    try {
      return await submitCourseReview(courseId, reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to submit review");
    }
  }
);

// Fetch course lessons
export const fetchCourseLessons = createAsyncThunk(
  "courses/fetchLessons",
  async (courseId, { rejectWithValue }) => {
    try {
      return await getCourseLessons(courseId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch lessons");
    }
  }
);

// Create course
export const createNewCourse = createAsyncThunk(
  "courses/create",
  async (courseData, { rejectWithValue }) => {
    try {
      return await createCourse(courseData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create course");
    }
  }
);

// Update course
export const updateExistingCourse = createAsyncThunk(
  "courses/update",
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      return await updateCourse(courseId, courseData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course");
    }
  }
);

// Verify Payment and Enroll
export const verifyPaymentAndEnroll = createAsyncThunk(
  "courses/verifyPayment",
  async (paymentData, { rejectWithValue, dispatch }) => {
    try {
      const response = await verifyPaymentAPI(paymentData);
      // Refresh enrolled courses after successful payment
      dispatch(fetchEnrolledCourses());
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Payment verification failed");
    }
  }
);
