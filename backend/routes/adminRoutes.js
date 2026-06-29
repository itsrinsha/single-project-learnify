import express from "express"
import {
  getAllUsers,
  deleteUser,
  getAllCoursesAdmin,
  deleteCourseAdmin,
  getInstructorRequests,
  approveInstructor,
  rejectInstructor,
  getAdminStats,
  getAllCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  getAllOffers,
  addOffer,
  deleteOffer,
  getEarnings,
  getInstructorAvailability,
  updateCourseStatus,
  getAdminLiveSessions,
  getAllPayments,
  getPaymentById,
  getBlockedUsers,
  blockUser,
  unblockUser,
  getActivityFeed,
  getReportsData
} from "../controllers/adminController.js";

import roleMiddleware from "../middleware/roleMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Stats
router.get("/stats", authMiddleware, roleMiddleware("admin"), getAdminStats);
router.get("/activity-feed", authMiddleware, roleMiddleware("admin"), getActivityFeed);
router.get("/reports", authMiddleware, roleMiddleware("admin"), getReportsData);

// User management
router.get("/users", authMiddleware, roleMiddleware("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

// Course management
router.get("/courses", authMiddleware, roleMiddleware("admin"), getAllCoursesAdmin);
router.delete("/courses/:id", authMiddleware, roleMiddleware("admin"), deleteCourseAdmin);
router.patch("/courses/:id/status", authMiddleware, roleMiddleware("admin"), updateCourseStatus);

// Instructor verification management
router.get(
  "/instructor-requests",
  authMiddleware,
  roleMiddleware("admin"),
  getInstructorRequests
);

router.patch(
  "/approve-instructor/:id",
  authMiddleware,
  roleMiddleware("admin"),
  approveInstructor
);

router.patch(
  "/reject-instructor/:id",
  authMiddleware,
  roleMiddleware("admin"),
  rejectInstructor
);

// Categories
router.get("/categories", authMiddleware, roleMiddleware("admin", "instructor", "student"), getAllCategories);
router.post("/categories", authMiddleware, roleMiddleware("admin"), addCategory);
router.put("/categories/:id", authMiddleware, roleMiddleware("admin"), updateCategory);
router.delete("/categories/:id", authMiddleware, roleMiddleware("admin"), deleteCategory);

// Offers
router.get("/offers", authMiddleware, roleMiddleware("admin"), getAllOffers);
router.post("/offers", authMiddleware, roleMiddleware("admin"), addOffer);
router.delete("/offers/:id", authMiddleware, roleMiddleware("admin"), deleteOffer);

// Earnings & Payments
router.get("/earnings", authMiddleware, roleMiddleware("admin"), getEarnings);
router.get("/payments", authMiddleware, roleMiddleware("admin"), getAllPayments);
router.get("/payments/:id", authMiddleware, roleMiddleware("admin"), getPaymentById);

// Availability & Live Sessions
router.get("/availability", authMiddleware, roleMiddleware("admin"), getInstructorAvailability);
router.get("/live-sessions", authMiddleware, roleMiddleware("admin"), getAdminLiveSessions);

// User Blocking
router.get("/blocked-users", authMiddleware, roleMiddleware("admin"), getBlockedUsers);
router.patch("/block-user/:id", authMiddleware, roleMiddleware("admin"), blockUser);
router.patch("/unblock-user/:id", authMiddleware, roleMiddleware("admin"), unblockUser);

export default router;