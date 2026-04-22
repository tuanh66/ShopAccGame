import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { cardTopUpValidator } from "../validators/cardTopUp.validator.js";
import {
  sepayWebhook,
  createBankAccounts,
  readBankAccounts,
  updateBankAccounts,
  cardTopUpCallback,
  createCardTopUp,
  readCardTopUp,
  updateCardTopUp,
  createTelecom,
  readTelecom,
  updateTelecom,
  deleteTelecom,
  readBankAccountsClient,
  readCardTopUpClient,
  submitCardTopUp,
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
router.post("/callback", cardTopUpCallback);
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
// Telecom
router.post(
  "/admin/telecom",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createTelecom,
);
router.get(
  "/admin/telecom",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readTelecom,
);
router.put(
  "/admin/telecom/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateTelecom,
);
router.delete(
  "/admin/telecom/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteTelecom,
);
// Client
// Chuyển khoản
router.get(
  "/bank-accounts",
  protectedRoute,
  authorize(ROLES.ADMIN, ROLES.MEMBER),
  readBankAccountsClient,
);
// Thẻ cào
// Telecom
router.get("/card-top-up", readCardTopUpClient);
router.post(
  "/submit-card-top-up",
  protectedRoute,
  authorize(ROLES.ADMIN, ROLES.MEMBER),
  cardTopUpValidator,
  validateRequest,
  submitCardTopUp,
);
export default router;
