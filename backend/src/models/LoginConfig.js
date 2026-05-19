import mongoose from "mongoose";

const loginConfigSchema = new mongoose.Schema(
  {
    // Cấu hình Facebook
    facebook: {
      appId: { type: String, default: "" },
      appSecret: { type: String, default: "" },
      redirectUri: { type: String, default: "" },
      active: { type: Boolean, default: false },
    },
    // Cấu hình Google
    google: {
      appId: { type: String, default: "" },
      appSecret: { type: String, default: "" },
      redirectUri: { type: String, default: "" },
      active: { type: Boolean, default: false },
    },
    // Cấu hình Discord
    discord: {
      appId: { type: String, default: "" },
      appSecret: { type: String, default: "" },
      redirectUri: { type: String, default: "" },
      active: { type: Boolean, default: false },
    },
    // Cấu hình Zalo
    zalo: {
      appId: { type: String, default: "" },
      appSecret: { type: String, default: "" },
      redirectUri: { type: String, default: "" },
      active: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const LoginConfig = mongoose.model("LoginConfig", loginConfigSchema);

export default LoginConfig;
