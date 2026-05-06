import express from "express";
import {
  readBankAccountsHistory,
  readCardTopUpHistory,
  readDiscountCodeHistory,
  readUserTransactionHistory,
  readUserTransactionHistoryById,
  readAccountsBoughtHistory,
  readAccountsBoughtHistoryById,
  updatePasswordStatus,
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
router.get(
  "/admin/discount-code",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readDiscountCodeHistory,
);

// Client
router.get(
  "/transaction-history",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  readUserTransactionHistory,
);
router.get(
  "/transaction-history/:userHistoryId",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  readUserTransactionHistoryById,
);
router.get(
  "/accounts-bought-history",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  readAccountsBoughtHistory,
);
router.get(
  "/accounts-bought-history/:id",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  readAccountsBoughtHistoryById,
);
router.post(
  "/accounts-bought-history/:id/get-password",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  updatePasswordStatus,
);

export default router;
