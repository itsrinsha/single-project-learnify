import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCourses,
  fetchFeaturedCourses,
  fetchCourseById,
  fetchEnrolledCourses,
  enrollInCourse,
  fetchCourseReviews,
  submitReview,
  fetchCourseLessons,
  createNewCourse,
  updateExistingCourse,
  verifyPaymentAndEnroll,
} from "./courseThunk";

const initialState = {
  courses: [],
  featuredCourses: [],
  enrolledCourses: [],
  selectedCourse: {
    details: null,
    lessons: [],
    reviews: [],
  },
  loading: false,
  error: null,
  success: false,
  filters: {
    category: "",
    search: "",
  },
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = initialState.selectedCourse;
    },
    clearState: (state) => {
      state.error = null;
      state.success = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Courses
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload?.courses || (Array.isArray(action.payload) ? action.payload : []);
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Featured Courses
      .addCase(fetchFeaturedCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredCourses = action.payload?.courses || action.payload;
      })
      .addCase(fetchFeaturedCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse.details = action.payload?.course || action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Enrolled Courses
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload?.courses || action.payload;
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Enroll In Course
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(enrollInCourse.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Course Reviews
      .addCase(fetchCourseReviews.fulfilled, (state, action) => {
        state.selectedCourse.reviews = action.payload?.reviews || action.payload;
      })

      // Submit Review
      .addCase(submitReview.fulfilled, (state, action) => {
        state.success = true;
        if (Array.isArray(state.selectedCourse.reviews)) {
          state.selectedCourse.reviews.push(action.payload);
        }
      })

      // Fetch Course Lessons
      .addCase(fetchCourseLessons.fulfilled, (state, action) => {
        state.selectedCourse.lessons = action.payload?.lessons || action.payload;
      })

      // Create Course
      .addCase(createNewCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const newCourse = action.payload?.course || action.payload;
        if (newCourse && newCourse._id) {
          state.courses.push(newCourse);
        }
      })
      .addCase(createNewCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Course
      .addCase(updateExistingCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExistingCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedCourse = action.payload?.course || action.payload;
        const index = state.courses.findIndex(c => c._id === updatedCourse?._id);
        if (index !== -1) {
          state.courses[index] = updatedCourse;
        }
      })
      .addCase(updateExistingCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Verify Payment
      .addCase(verifyPaymentAndEnroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPaymentAndEnroll.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyPaymentAndEnroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearSelectedCourse, clearState } = courseSlice.actions;
export default courseSlice.reducer;
