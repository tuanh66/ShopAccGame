import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", protectedRoute, authorize(ROLES.ADMIN), getDashboardStats);

export default router;
