import mongoose from "mongoose";

const accountDetailSchema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountCategory",
      required: true,
      index: true,
    },
    user_detail: {
      type: String,
      required: true,
    },
    password_detail: {
      type: String,
      required: true,
    },
    price_detail: {
      type: Number,
      required: true,
    },
    price_old_detail: {
      type: Number,
      required: true,
    },
    slug_detail: {
      type: String,
      unique: true,
    },
    image_detail: {
      type: [String],
      default: [],
    },
    attributes_detail: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

accountDetailSchema.index({ category_id: 1, user_detail: 1 }, { unique: true });

const AccountDetail = mongoose.model("AccountDetail", accountDetailSchema);
export default AccountDetail;
