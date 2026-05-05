import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  createDiscountCode,
  readDiscountCode,
  readDiscountCodeById,
  updateDiscountCode,
  deleteDiscountCode,
  applyDiscountCode,
} from "../controllers/discountCodeController.js";

const router = express.Router();

// Admin
router.post(
  "/admin",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createDiscountCode,
);
router.get(
  "/admin",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readDiscountCode,
);
router.get(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readDiscountCodeById,
);
router.put(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateDiscountCode,
);
router.delete(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteDiscountCode,
);

// Client - áp dụng mã giảm giá
router.post("/apply", protectedRoute, applyDiscountCode);

export default router;
