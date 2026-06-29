import express from "express";
import {
  createMission,
  getCourseMissions,
  submitMission,
  getMissionSubmissions,
  evaluateSubmission,
} from "../controllers/missionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Mission CRUD & listing
router.post("/", authMiddleware, createMission);
router.get("/course/:courseId", authMiddleware, getCourseMissions);

// Submissions & evaluations
router.post("/:id/submit", authMiddleware, submitMission);
router.get("/:id/submissions", authMiddleware, getMissionSubmissions);
router.put("/submissions/:subId/evaluate", authMiddleware, evaluateSubmission);

export default router;
