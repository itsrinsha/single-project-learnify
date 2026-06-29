import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
});

// Upload Thumbnail (Image)
router.post("/thumbnail", authMiddleware, upload.single("thumbnail"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "learnify/thumbnails", "image");

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Thumbnail Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Upload Profile Picture
router.post("/profile-picture", authMiddleware, upload.single("profilePicture"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "learnify/profiles", "image");

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Profile Picture Upload Error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

// Upload Video
router.post("/video", authMiddleware, upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "learnify/videos", "video");

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Video Upload Error:", error);
    res.status(500).json({ message: "Video upload failed", error: error.message });
  }
});

// Upload assessment resources and assignment attachments
router.post("/resource", authMiddleware, upload.single("resource"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const isPdf = req.file.originalname?.toLowerCase().endsWith(".pdf");
    const resourceType = isPdf ? "image" : "raw";

    const result = await uploadToCloudinary(
      req.file.buffer,
      "learnify/resources",
      resourceType,
      req.file.originalname
    );

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Resource Upload Error:", error);
    res.status(500).json({ message: "Resource upload failed", error: error.message });
  }
});

export default router;
