import express from "express";
import roleMiddleware from "../middleware/roleMiddleware.js";

import {
  getInstructorCourses,
  getInstructorDashboard,
  publishCourse,
  submitVerification,
  createCourseDraft,
  addModule,
  addLesson,
  getCourseDetails,
  updateCourse,
  updateLesson,
  deleteCourse,
  getInstructorStudents,
  scheduleReviewSession,
  getInstructorScheduledReviews,
  getReviewHistory,
  deleteReviewSession,
  updateReviewStatus,
  completeStudentCourse,
} from "../controllers/instructorController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

import approvalMiddleware from "../middleware/approvalMiddleware.js";

const router = express.Router();

// ✅ Dashboard
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorDashboard
);

// ✅ Verification
router.post(
  "/verify",
  authMiddleware,
  roleMiddleware("instructor"),
  submitVerification
);

// ✅ Courses
router.get(
  "/courses",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorCourses
);

router.get(
  "/students",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorStudents
);

router.post(
  "/course/:courseId/student/:studentId/complete",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  completeStudentCourse
);

router.get(
  "/courses/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getCourseDetails
);

router.put(
  "/courses/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  updateCourse
);

router.put(
  "/courses/:id/publish",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  publishCourse
);

router.delete(
  "/courses/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  deleteCourse
);

// ✅ Create Course
router.post(
  "/courses/create",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  createCourseDraft
);

// ✅ Add Module
router.post(
  "/courses/:courseId/modules",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addModule
);

// ✅ Add Lesson
router.post(
  "/courses/:courseId/modules/:moduleId/lessons",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  addLesson
);

router.put(
  "/courses/:courseId/lessons/:lessonId",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  updateLesson
);

router.get(
  "/review-history",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getReviewHistory
);

router.post(
  "/schedule-review",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  scheduleReviewSession
);

router.get(
  "/scheduled-reviews",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getInstructorScheduledReviews
);

import {
  getPendingCertificates,
  approveCertificate,
  rejectCertificate
} from "../controllers/certificateController.js";

router.delete(
  "/scheduled-reviews/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  deleteReviewSession
);

router.patch(
  "/scheduled-reviews/:id/status",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  updateReviewStatus
);

// ✅ Certificates approval flow
router.get(
  "/certificates/pending",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  getPendingCertificates
);

router.patch(
  "/certificates/:id/approve",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  approveCertificate
);

router.patch(
  "/certificates/:id/reject",
  authMiddleware,
  roleMiddleware("instructor"),
  approvalMiddleware,
  rejectCertificate
);

export default router;