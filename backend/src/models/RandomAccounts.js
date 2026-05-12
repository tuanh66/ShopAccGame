import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const randomAccountsSchema = new mongoose.Schema(
  {
    randomCategories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RandomCategories",
      required: true,
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    randomAccountsId: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      default: [],
    },
    tier: {
      type: String,
      enum: ["thuong", "ngon", "sieuPham"],
      default: "thuong",
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

randomAccountsSchema.index(
  { randomCategories_id: 1, username: 1 },
  { unique: true },
);
randomAccountsSchema.plugin(AutoIncrement, {
  inc_field: "randomAccountsId",
});

const RandomAccounts = mongoose.model("RandomAccounts", randomAccountsSchema);
export default RandomAccounts;
