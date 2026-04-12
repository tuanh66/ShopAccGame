import express from "express";
import { readBankAccountsHistory } from "../controllers/historyController.js";
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

// Client

export default router;
