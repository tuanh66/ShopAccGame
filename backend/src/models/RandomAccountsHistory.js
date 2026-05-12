import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const randomAccountsHistorySchema = new mongoose.Schema(
  {
    historyRandomAccountsId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
    },
    categoriesId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    tier: {
      type: String,
      enum: ["thuong", "ngon", "sieuPham"],
    },
    price: {
      type: Number,
      required: true,
    },
    passwordStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

randomAccountsHistorySchema.plugin(AutoIncrement, {
  inc_field: "historyRandomAccountsId",
  start_seq: 1,
});

const RandomAccountsHistory = mongoose.model(
  "RandomAccountsHistory",
  randomAccountsHistorySchema,
);

export default RandomAccountsHistory;
