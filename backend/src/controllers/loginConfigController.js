import axios from "axios";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";
import LoginConfig from "../models/LoginConfig.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

// --- HÀM HELPER DÙNG CHUNG ĐỂ XỬ LÝ ĐĂNG NHẬP ---
const handleSocialLogin = async (req, res, provider, profile) => {
  const { id, email, name, avatar } = profile;

  // 1. Tìm user theo providerId hoặc email
  let user = await User.findOne({
    $or: [{ providerId: id }, { email: email }],
  });

  if (!user) {
    // Nếu chưa có thì tạo mới
    user = await User.create({
      username: `${provider}_${id.substring(0, 8)}_${Math.random().toString(36).slice(-4)}`,
      email: email || `${id}@${provider}.com`, // Nếu provider không trả về email
      avatar: avatar,
      provider: provider,
      providerId: id,
      isEmailVerified: true, // Social login mặc định là đã verify email
    });
  } else {
    // Nếu đã có thì cập nhật thông tin mới nhất
    if (avatar) user.avatar = avatar;
    user.provider = provider;
    user.providerId = id;
    await user.save();
  }

  // 2. Tạo Token (Giống hệt logic signIn của bạn)
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");
  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  // 3. Trả về cookie và redirect về Frontend
  const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isSecure || process.env.NODE_ENV === "production",
    sameSite: (isSecure || process.env.NODE_ENV === "production") ? "none" : "lax",
    maxAge: REFRESH_TOKEN_TTL,
  });

  // Redirect về trang chủ hoặc trang xử lý login thành công ở frontend
  return res.redirect(
    `${process.env.CLIENT_URL}/login-success?token=${accessToken}`,
  );
};

// Lấy cấu hình đăng nhập (Admin)
export const getLoginConfig = async (req, res) => {
  try {
    let config = await LoginConfig.findOne();
    if (!config) {
      config = await LoginConfig.create({});
    }
    return res.status(200).json(config);
  } catch (error) {
    console.error("Lỗi getLoginConfig:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy cấu hình đăng nhập (Public - chỉ lấy trạng thái active)
export const getPublicLoginConfig = async (req, res) => {
  try {
    let config = await LoginConfig.findOne();
    if (!config) {
      return res.status(200).json({
        facebookActive: false,
        googleActive: false,
        discordActive: false,
        zaloActive: false,
      });
    }
    return res.status(200).json({
      facebookActive: config.facebook?.active || false,
      googleActive: config.google?.active || false,
      discordActive: config.discord?.active || false,
      zaloActive: config.zalo?.active || false,
    });
  } catch (error) {
    console.error("Lỗi getPublicLoginConfig:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật cấu hình đăng nhập (Admin)
export const updateLoginConfig = async (req, res) => {
  try {
    const { facebook, google, discord, zalo } = req.body;

    let config = await LoginConfig.findOne();
    if (!config) {
      config = new LoginConfig();
    }

    if (facebook) config.facebook = facebook;
    if (google) config.google = google;
    if (discord) config.discord = discord;
    if (zalo) config.zalo = zalo;

    await config.save();

    return res.status(200).json({
      message: "Cập nhật cấu hình thành công",
      data: config,
    });
  } catch (error) {
    console.error("Lỗi updateLoginConfig:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// --- LOGIC ĐIỀU HƯỚNG SANG TRANG ĐĂNG NHẬP CỦA PROVIDER ---

export const loginGoogle = async (req, res) => {
  try {
    const config = await LoginConfig.findOne();
    if (!config?.google?.active)
      return res.status(400).send("Google Login is disabled");
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${config.google.appId}&redirect_uri=${config.google.redirectUri}&scope=openid%20email%20profile`;
    res.redirect(url);
  } catch (error) {
    res.status(500).send("Lỗi hệ thống");
  }
};

export const loginFacebook = async (req, res) => {
  try {
    const config = await LoginConfig.findOne();
    if (!config?.facebook?.active)
      return res.status(400).send("Facebook Login is disabled");
    const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${config.facebook.appId}&redirect_uri=${config.facebook.redirectUri}&scope=email,public_profile`;
    res.redirect(url);
  } catch (error) {
    res.status(500).send("Lỗi hệ thống");
  }
};

// --- LOGIC CALLBACK NHẬN DỮ LIỆU ---

export const callbackFacebook = async (req, res) => {
  try {
    const { code } = req.query;
    const config = await LoginConfig.findOne();
    if (!config?.facebook?.active)
      return res.status(400).send("Facebook Login disabled");

    const tokenRes = await axios.get(
      `https://graph.facebook.com/v12.0/oauth/access_token`,
      {
        params: {
          client_id: config.facebook.appId,
          client_secret: config.facebook.appSecret,
          redirect_uri: config.facebook.redirectUri,
          code,
        },
      },
    );

    const userRes = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: "id,name,email,picture.type(large)",
        access_token: tokenRes.data.access_token,
      },
    });

    const profile = {
      id: userRes.data.id,
      email: userRes.data.email,
      name: userRes.data.name,
      avatar: userRes.data.picture?.data?.url,
    };

    return handleSocialLogin(req, res, "facebook", profile);
  } catch (error) {
    console.error(
      "Lỗi callbackFacebook:",
      error.response?.data || error.message,
    );
    res.redirect(`${process.env.CLIENT_URL}/login?error=facebook_failed`);
  }
};

export const callbackGoogle = async (req, res) => {
  try {
    const { code } = req.query;
    const config = await LoginConfig.findOne();
    if (!config?.google?.active)
      return res.status(400).send("Google Login disabled");

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: config.google.appId,
      client_secret: config.google.appSecret,
      redirect_uri: config.google.redirectUri,
      grant_type: "authorization_code",
    });

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
      },
    );

    const profile = {
      id: userRes.data.id,
      email: userRes.data.email,
      name: userRes.data.name,
      avatar: userRes.data.picture,
    };

    return handleSocialLogin(req, res, "google", profile);
  } catch (error) {
    console.error("Lỗi callbackGoogle:", error.response?.data || error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

export const callbackDiscord = async (req, res) => {
  try {
    const { code } = req.query;
    const config = await LoginConfig.findOne();
    const params = new URLSearchParams({
      client_id: config.discord.appId,
      client_secret: config.discord.appSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: config.discord.redirectUri,
    });

    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
    );
    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
    });

    const profile = {
      id: userRes.data.id,
      email: userRes.data.email,
      name: userRes.data.username,
      avatar: `https://cdn.discordapp.com/avatars/${userRes.data.id}/${userRes.data.avatar}.png`,
    };

    return handleSocialLogin(req, res, "discord", profile);
  } catch (error) {
    console.error(
      "Lỗi callbackDiscord:",
      error.response?.data || error.message,
    );
    res.redirect(`${process.env.CLIENT_URL}/login?error=discord_failed`);
  }
};

export const callbackZalo = async (req, res) => {
  try {
    const { code } = req.query;
    const config = await LoginConfig.findOne();

    // Zalo cần code_verifier nếu dùng PKCE, ở đây mình giả định flow chuẩn
    const tokenRes = await axios.post(
      "https://oauth.zaloapp.com/v4/access_token",
      new URLSearchParams({
        code,
        app_id: config.zalo.appId,
        grant_type: "authorization_code",
      }),
      { headers: { secret_key: config.zalo.appSecret } },
    );

    const userRes = await axios.get(
      "https://graph.zalo.me/v2.0/me?fields=id,name,picture",
      {
        headers: { access_token: tokenRes.data.access_token },
      },
    );

    const profile = {
      id: userRes.data.id,
      email: null,
      name: userRes.data.name,
      avatar: userRes.data.picture?.data?.url,
    };

    return handleSocialLogin(req, res, "zalo", profile);
  } catch (error) {
    console.error("Lỗi callbackZalo:", error.response?.data || error.message);
    res.redirect(`${process.env.CLIENT_URL}/login?error=zalo_failed`);
  }
};
