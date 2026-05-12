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
  createRandomAccounts,
  readRandomAccounts,
  readRandomAccountsById,
  updateRandomAccounts,
  deleteRandomAccounts,
  readCategoriesAccountStatus,
  readCategoriesAccountId,
  buyAccount,
  readAccountBoughtDetail,
} from "../controllers/accountsController.js";

const router = express.Router();

// Admin
// Accounts
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

// Random Accounts
router.post(
  "/admin/random",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createRandomAccounts,
);

router.get(
  "/admin/random/:slug",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readRandomAccounts,
);

router.get(
  "/admin/random/detail/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readRandomAccountsById,
);

router.put(
  "/admin/random/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateRandomAccounts,
);

router.delete(
  "/admin/random/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteRandomAccounts,
);

// Client
router.get("/:slug", readCategoriesAccountStatus);
router.get("/:slug/:id", readCategoriesAccountId);
router.post(
  "/:id/buy-account",
  protectedRoute,
  authorize(ROLES.MEMBER, ROLES.ADMIN),
  buyAccount,
);
router.get("/bought-detail/:id", protectedRoute, readAccountBoughtDetail);

export default router;
