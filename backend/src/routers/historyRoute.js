import express from "express";
import {
  readBankAccountsHistory,
  readCardTopUpHistory,
} from "../controllers/historyController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

// Admin
router.get(
  "/admin/bank-accounts",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readBankAccountsHistory,
);
router.get(
  "/admin/card-top-up",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readCardTopUpHistory,
);

// Client

export default router;
