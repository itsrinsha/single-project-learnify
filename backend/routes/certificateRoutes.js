import express from "express";
import { 
  claimCertificate, 
  getMyCertificates, 
  downloadCertificatePDF,
  approveCertificate,
  rejectCertificate,
  getPendingCertificates,
  getInstructorAllCertificates,
  getCertificateById,
  verifyCertificate,
} from "../controllers/certificateController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// ── Student Routes ──────────────────────────────────────────────
router.post("/claim", authMiddleware, claimCertificate);
router.get("/my-certificates", authMiddleware, getMyCertificates);
router.get("/download/:id", authMiddleware, downloadCertificatePDF);
router.get("/:id", authMiddleware, getCertificateById);

// ── Public Routes ───────────────────────────────────────────────
router.get("/verify/:certificateCode", verifyCertificate);

// ── Instructor Routes ───────────────────────────────────────────
// Pending only (courseCompleted=true, status=pending)
router.get("/instructor/pending", authMiddleware, roleMiddleware("instructor"), getPendingCertificates);
// All statuses (for history tab)
router.get("/instructor/all", authMiddleware, roleMiddleware("instructor"), getInstructorAllCertificates);
// Approve
router.put("/approve/:id", authMiddleware, roleMiddleware("instructor"), approveCertificate);
// Reject
router.put("/reject/:id", authMiddleware, roleMiddleware("instructor"), rejectCertificate);

export default router;
