import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  enrollCourse,
  getEnrolledCourses,
  getStudentDashboard,
  getInstructorsByStudent,
  getMyEnrolledLiveSessions,
  getMyEnrolledReviews,
  getStudentScheduledReviews,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, getStudentDashboard);

// profile
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

// enroll
router.post("/enroll", authMiddleware, enrollCourse);

// enrolled courses
router.get("/enrollments", authMiddleware, getEnrolledCourses);

// instructors
router.get("/my-instructors", authMiddleware, getInstructorsByStudent);

// enrolled live sessions
router.get("/my-live-sessions", authMiddleware, getMyEnrolledLiveSessions);

// enrolled reviews
router.get("/my-reviews", authMiddleware, getMyEnrolledReviews);

import { deleteReviewSession } from "../controllers/instructorController.js";

// scheduled reviews (for students)
router.get("/scheduled-reviews", authMiddleware, getStudentScheduledReviews);
router.delete("/scheduled-reviews/:id", authMiddleware, deleteReviewSession);

export default router;