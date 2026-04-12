import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  createCategories,
  readCategories,
  readCategoriesById,
  updateCategories,
  addCategoriesAttribute,
  removeCategoriesAttribute,
  deleteCategories,
  readCategoriesStatus,
} from "../controllers/categoriesController.js";

const router = express.Router();

// Admin
router.post("/admin", protectedRoute, authorize(ROLES.ADMIN), createCategories);

router.get("/admin", protectedRoute, authorize(ROLES.ADMIN), readCategories);

router.get("/admin", protectedRoute, authorize(ROLES.ADMIN), readCategories);

router.get(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readCategoriesById,
);

router.put(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateCategories,
);

router.post(
  "/admin/:id/attribute",
  protectedRoute,
  authorize(ROLES.ADMIN),
  addCategoriesAttribute,
);

router.delete(
  "/admin/:id/attribute/:key",
  protectedRoute,
  authorize(ROLES.ADMIN),
  removeCategoriesAttribute,
);

router.delete(
  "/admin/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteCategories,
);
// Client
router.get("/", readCategoriesStatus);

export default router;
