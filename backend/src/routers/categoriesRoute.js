import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  readAllSlug,
  createCategories,
  readCategories,
  readCategoriesById,
  updateCategories,
  addCategoriesAttribute,
  removeCategoriesAttribute,
  deleteCategories,
  createRandomCategories,
  readRandomCategories,
  readRandomCategoriesById,
  updateRandomCategoriesById,
  deleteRandomCategoriesById,
  readCategoriesStatus,
} from "../controllers/categoriesController.js";

const router = express.Router();

// Admin
router.get(
  "/admin/all-slug",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readAllSlug,
);
// Random
router.post(
  "/admin/random-categories",
  protectedRoute,
  authorize(ROLES.ADMIN),
  createRandomCategories,
);

router.get(
  "/admin/random-categories",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readRandomCategories,
);

router.get(
  "/admin/random-categories/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readRandomCategoriesById,
);

router.put(
  "/admin/random-categories/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateRandomCategoriesById,
);

router.delete(
  "/admin/random-categories/:id",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteRandomCategoriesById,
);

router.post("/admin", protectedRoute, authorize(ROLES.ADMIN), createCategories);

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
