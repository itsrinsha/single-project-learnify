import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getStudentCertificates,
  getStudentCertificateById,
  downloadStudentCertificatePDF,
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/certificates", authMiddleware, getStudentCertificates);
router.get("/certificate/:id", authMiddleware, getStudentCertificateById);
router.get("/certificate/download/:id", authMiddleware, downloadStudentCertificatePDF);

export default router;
