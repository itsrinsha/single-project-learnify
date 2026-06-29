import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { saveVideoProgress, getVideoProgress } from "../controllers/videoController.js";

const router = express.Router();

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Cloudinary Config (Assume keys are in env or configured elsewhere)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post(
  "/upload-video",
  upload.single("video"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          resource_type: "video",
          folder: "learnify-videos",
        }
      );

      res.status(200).json({
        success: true,
        videoUrl: result.secure_url,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// Progress tracking routes
router.post("/save-progress", authMiddleware, saveVideoProgress);
router.get("/progress/:lessonId", authMiddleware, getVideoProgress);

export default router;
