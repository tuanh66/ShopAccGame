import mongoose from "mongoose";

const accountCategorySchema = new mongoose.Schema(
  {
    name_category: {
      type: String,
      required: true,
    },
    slug_category: {
      type: String,
      required: true,
      unique: true,
    },
    image_category: {
      type: String,
      required: true,
    },
    attributes_category: {
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

const AccountCategory = mongoose.model(
  "AccountCategory",
  accountCategorySchema
);
export default AccountCategory;
