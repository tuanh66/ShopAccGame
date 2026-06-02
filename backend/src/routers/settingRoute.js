import express from "express";
import { getSocial, updateSocial } from "../controllers/settingsController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

// Public route for landing page/client UI
router.get("/social/public", getSocial);

// Admin private routes
router.get("/social", protectedRoute, authorize("admin"), getSocial);
router.put("/social", protectedRoute, authorize("admin"), updateSocial);

export default router;
