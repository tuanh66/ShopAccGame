import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  sepayWebhook,
  createBankAccounts,
  readBankAccounts,
  updateBankAccounts,
  cardTopUpWebhook,
  createCardTopUp,
  readCardTopUp,
  updateCardTopUp,
  readBankAccountsClient,
} from "../controllers/paymentController.js";

const router = express.Router();
// Admin
// Chuyển khoản
router.post("/sepay-webhook", sepayWebhook);
router.post(
  "/admin/bank-accounts",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createBankAccounts,
);
router.get(
  "/admin/bank-accounts",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readBankAccounts,
);
router.put(
  "/admin/bank-accounts",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateBankAccounts,
);
// Thẻ cào
router.post("/card-top-up-webhook", cardTopUpWebhook);
router.post(
  "/admin/card-top-up",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createCardTopUp,
);
router.get(
  "/admin/card-top-up",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readCardTopUp,
);
router.put(
  "/admin/card-top-up",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateCardTopUp,
);
// Client
router.get(
  "/bank-accounts",
  // protectedRoute,
  // authorize(ROLES.ADMIN, ROLES.MEMBER),
  readBankAccountsClient,
);
export default router;
