import { body } from "express-validator";
import User from "../models/User.js";

export const signUpValidator = [
  // Username
  body("username")
    .notEmpty()
    .withMessage("Tên đăng nhập không được để trống.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Tên đăng nhập phải từ 3 đến 30 ký tự.")
    .custom(async (value) => {
      const exists = await User.findOne({ username: value });
      if (exists) {
        throw new Error("Tên đăng nhập đã tồn tại.");
      }
      return true;
    }),

  // Password
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống.")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),

  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Mật khẩu xác nhận không khớp.");
    }
    return true;
  }),

  // Email
  body("email")
    .notEmpty()
    .withMessage("Email không được để trống.")
    .isEmail()
    .withMessage("Email không đúng định dạng.")
    .custom(async (value) => {
      const exists = await User.findOne({ email: value });
      if (exists) {
        throw new Error("Email đã tồn tại.");
      }
      return true;
    }),
];
