import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // 5 lần
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Bạn đã đăng nhập sai quá nhiều lần. Thử lại sau 15 phút.",
  },
});