import express from "express";
import { markLessonCompleted, getCourseProgress, getProgressByStudent } from "../controllers/progressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow both mark-completed and complete-lesson for compatibility & requirements
router.post("/mark-completed", authMiddleware, markLessonCompleted);
router.post("/complete-lesson", authMiddleware, markLessonCompleted);

router.get("/:courseId", authMiddleware, getCourseProgress);
router.get("/course/:courseId/student/:studentId", authMiddleware, getProgressByStudent);

export default router;
