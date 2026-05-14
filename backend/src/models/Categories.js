import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const categoriesSchema = new mongoose.Schema(
  {
    categoriesId: {
      type: Number,
      unique: true,
    },
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

categoriesSchema.plugin(AutoIncrement, {
  inc_field: "categoriesId",
});
const Categories = mongoose.model("Categories", categoriesSchema);
export default Categories;
