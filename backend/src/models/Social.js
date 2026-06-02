import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    social: {
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      telegram: { type: String, default: "" },
      discord: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      zalo: { type: String, default: "" },
    },
    time: { type: String, default: "" },
  },
  {
    timestamps: true,
  },
);

const Social = mongoose.model("Social", socialSchema);
export default Social;
