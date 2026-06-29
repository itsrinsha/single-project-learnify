import express from "express";

import {
  createOrder,
  verifyPayment,
  recordPaymentFailure,
} from "../controllers/paymentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);

router.post("/verify", authMiddleware, verifyPayment);

router.post("/record-failure", authMiddleware, recordPaymentFailure);

export default router;