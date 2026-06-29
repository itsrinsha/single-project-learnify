import express from "express";
import {
  sendMessage,
  getMessages,
  markAsRead,
  getConversations,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";



const router = express.Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);
router.put("/read/:userId", authMiddleware, markAsRead);

export default router;