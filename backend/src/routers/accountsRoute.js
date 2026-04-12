import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  createAccounts,
  readAccountsAttributeBySlugCategories,
  readAccounts,
  readAccountsById,
  updateAccounts,
  deleteAccounts,
  readCategoriesAccountStatus,
  readCategoriesAccountId,
  readCategoriesAccountRelate,
  buyAccount,
} from "../controllers/accountsController.js";

const router = express.Router();

// Admin
router.post("/admin", protectedRoute, authorize(ROLES.ADMIN), createAccounts);

router.get(
  "/admin/attributes/:slugCategoriesAttribute",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readAccountsAttributeBySlugCategories,
);

router.get(
  "/admin/category/:slugCategories",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readAccounts,
);

router.get(
  "/admin/detail/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readAccountsById,
);

router.put(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateAccounts,
);
router.delete(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteAccounts,
);

// Client
router.get("/:slug", readCategoriesAccountStatus);
router.get("/:slug/:id", readCategoriesAccountId);
router.get("/:slug/:id/relate", readCategoriesAccountRelate);
router.post(
  "/:id/buy-account",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  buyAccount,
);

export default router;
