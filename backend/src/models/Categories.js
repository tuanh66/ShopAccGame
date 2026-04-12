import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
    },
    attributes: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Categories = mongoose.model("Categories", categoriesSchema);
export default Categories;
