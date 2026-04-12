import express from "express";
import { loginLimiter } from "../middlewares/limiterMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { signUpValidator } from "../validators/signUp.validator.js";
import {
  signUp,
  signIn,
  signOut,
  refreshToken,
  getCaptcha,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUpValidator, validateRequest, signUp);
router.post("/signin", validateRequest, signIn);
router.post("/signout", signOut);
router.post("/refresh", refreshToken);
router.get("/captcha", getCaptcha);


export default router;
