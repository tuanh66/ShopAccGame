import express from "express";
import {
  getLoginConfig,
  getPublicLoginConfig,
  updateLoginConfig,
  loginGoogle,
  loginFacebook,
  callbackFacebook,
  callbackGoogle,
  callbackDiscord,
  callbackZalo,
} from "../controllers/loginConfigController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorize, ROLES } from "../middlewares/authorizeMiddleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/public", getPublicLoginConfig);

// --- ADMIN ROUTES ---
router.get("/", protectedRoute, authorize(ROLES.ADMIN), getLoginConfig);
router.put("/", protectedRoute, authorize(ROLES.ADMIN), updateLoginConfig);

// --- USER LOGIN ROUTES (Nút bấm ở Client gọi link này) ---
router.get("/google", loginGoogle);
router.get("/facebook", loginFacebook);
// Bạn có thể thêm loginDiscord, loginZalo tương tự nếu muốn điều hướng từ backend

// --- CALLBACK ROUTES (Nhà cung cấp gọi về link này) ---
router.get("/callback/facebook", callbackFacebook);
router.get("/callback/google", callbackGoogle);
router.get("/callback/discord", callbackDiscord);
router.get("/callback/zalo", callbackZalo);

export default router;
