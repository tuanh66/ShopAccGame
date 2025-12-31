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
} from "../controllers/accountController.js";

const router = express.Router();

router.get("/category", readAccountCategory);
// router.get("/category/:id");
router.post(
  "/category/create",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createAccountCategory
);
router.post(
  "/category/:id/attribute/add",
  protectedRoute,
  authorize(ROLES.ADMIN),
  addAccountCategoryAttribute
);
router.post(
  "/category/:id/attribute/:key",
  protectedRoute,
  authorize(ROLES.ADMIN),
  removeAccountCategoryAttribute
);
router.post(
  "/category/update/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateAccountCategory
);
router.post(
  "/category/delete/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteAccountCategory
);
router.get("/detail", readAccountDetail);
router.get("/detail/:id");
router.post(
  "/detail/create",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createAccountDetail
);
router.post(
  "/detail/update/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateAccountDetail
);
router.post(
  "/detail/delete/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteAccountDetail
);
export default router;
