import mongoose from "mongoose";

const transactionHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    transaction: {
      type: String,
      enum: ["bankAccount", "cardTopUp", "buyAccount", "adminTopUp"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balance_before: {
      type: Number,
      required: true,
      min: 0,
    },
    balance_after: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const UserHistory = mongoose.model(
  "UserHistory",
  transactionHistorySchema,
);
export default UserHistory;
