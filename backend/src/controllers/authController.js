import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Session from "../models/Session.js";


// Đã bỏ loadFont vì chuyển sang dùng font hệ thống mặc định siêu nét

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 144 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    // 1. Lấy lỗi validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    // 2. Lấy dữ liệu (đã được validate)
    const { username, password, email } = req.body;

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo user
    await User.create({
      username,
      password: hashedPassword, // nên lưu field là password
      email,
    });

    // return
    return res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    }

    // lấy hashedPassword trong db để so với password input
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "username hoặc password không chính xác" });
    }

    // check tài khoản bị khoá
    if (!user.status) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "username hoặc password không chính xác" });
    }

    let ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;
    if (ip === "::1") ip = "127.0.0.1";
    user.lastIp = ip;
    await user.save();

    // nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );
    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo sesstion mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    //  trả refresh về trong cookie
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isSecure || process.env.NODE_ENV === "production",
      sameSite: (isSecure || process.env.NODE_ENV === "production") ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả access token về trong res
    return res
      .status(200)
      .json({ message: `User ${user.username} đã logged in!`, accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi signIn:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xóa session token trong session
      await Session.deleteOne({ refreshToken: token });
      // xoá cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }
    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }
    // tạo access token mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getCaptcha = async (req, res) => {
  try {
    // Tự sinh 3 chữ số ngẫu nhiên
    const text = Math.floor(100 + Math.random() * 900).toString();

    // Tạo mã SVG bằng mã HTML thô siêu nét, ép dùng font hệ thống mặc định để chắc chắn đặc ruột
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="62" height="32" viewBox="0 0 62 32">
      <rect width="100%" height="100%" fill="#F3F3F7" />
      <text x="31" y="23" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" font-size="22" font-weight="bold" fill="#EF4444" text-anchor="middle" letter-spacing="4">${text}</text>
    </svg>`;

    const captchaToken = jwt.sign(
      { text: text },
      process.env.ACCESS_TOKEN_SECRET || "CAPTCHA_SECRET",
      { expiresIn: "5m" },
    );

    res.cookie("captchaToken", captchaToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 5 * 60 * 1000,
    });

    res.type("svg");
    return res.status(200).send(svgString);
  } catch (error) {
    console.error("Lỗi khi gọi getCaptcha:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi sinh captcha" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 1. Validate inputs
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // 2. Tìm user (lấy cả password để so sánh)
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // 3. Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });
    }

    // 4. Hash mật khẩu mới và lưu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi changePassword:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
