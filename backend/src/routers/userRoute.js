import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import {
  authMe,
  readListUser,
  readUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectedRoute, authMe);
router.get("/admin/list", protectedRoute, authorize(ROLES.ADMIN), readListUser);
router.get(
  "/admin/:userId",
  protectedRoute,
  authorize(ROLES.ADMIN),
  readUserById,
);
router.put(
  "/admin/:userId",
  protectedRoute,
  authorize(ROLES.ADMIN),
  updateUserById,
);
router.delete(
  "/admin/:userId",
  protectedRoute,
  authorize(ROLES.ADMIN),
  deleteUserById,
);

export default router;
