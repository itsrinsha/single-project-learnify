import express from "express";
import {
  createLiveSession,
  getLiveSessions,
  startLiveSession,
  endLiveSession,
  getMyLiveSessions,
  deleteLiveSession,
} from "../controllers/liveController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.post("/", authMiddleware, createLiveSession);
router.get("/my-sessions", authMiddleware, getMyLiveSessions);
router.get("/:courseId", getLiveSessions);

router.put("/:id/start", authMiddleware, startLiveSession);
router.put("/:id/end", authMiddleware, endLiveSession);
router.delete("/:id", authMiddleware, deleteLiveSession);

export default router;