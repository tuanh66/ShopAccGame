import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const randomCategoriesSchema = new mongoose.Schema(
  {
    randomCategoriesId: {
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
    price: {
      type: Number,
      required: true,
    },
    chance: {
      thuong: { type: Number, default: 80 },
      ngon: { type: Number, default: 15 },
      sieuPham: { type: Number, default: 5 },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

randomCategoriesSchema.plugin(AutoIncrement, {
  inc_field: "randomCategoriesId",
});

const RandomCategories = mongoose.model(
  "RandomCategories",
  randomCategoriesSchema,
);
export default RandomCategories;
