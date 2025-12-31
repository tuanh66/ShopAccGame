import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { signUpValidator } from "../validators/signUp.validator.js";
import { signUp, signIn, signOut } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUpValidator, validateRequest, signUp);
router.post("/signin", validateRequest, signIn);
router.post("/signout", signOut);

export default router;
