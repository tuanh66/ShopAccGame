import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  readAccountCategory,
  createAccountCategory,
  addAccountCategoryAttribute,
  removeAccountCategoryAttribute,
  updateAccountCategory,
  deleteAccountCategory,
  readAccountDetail,
  createAccountDetail,
  updateAccountDetail,
  deleteAccountDetail,
  readAccountCategoryClient,
  readAccountByCategorySlug,
  readAccountByDetailSlug,
  readRelatedAccounts,
} from "../controllers/accountController.js";

const router = express.Router();

// Admin
router.get("/admin/category", readAccountCategory);
router.post(
  "/admin/category/create",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createAccountCategory
);
router.post(
  "/admin/category/:id/attribute/add",
  protectedRoute,
  authorize(ROLES.ADMIN),
  addAccountCategoryAttribute
);
router.post(
  "/admin/category/:id/attribute/:key",
  protectedRoute,
  authorize(ROLES.ADMIN),
  removeAccountCategoryAttribute
);
router.post(
  "/admin/category/update/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateAccountCategory
);
router.post(
  "/admin/category/delete/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteAccountCategory
);
router.get("/admin/detail", readAccountDetail);
router.post(
  "/admin/detail/create",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createAccountDetail
);
router.post(
  "/admin/detail/update/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateAccountDetail
);
router.post(
  "/admin/detail/delete/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteAccountDetail
);
export default router;

// Client
router.get("/category", readAccountCategoryClient);
router.get("/category/:slugCategory", readAccountByCategorySlug);
router.get("/detail/:slugDetail", readAccountByDetailSlug);
router.get("/related/:slugDetail", readRelatedAccounts);
