import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const userHistorySchema = new mongoose.Schema(
  {
    userHistoryId: {
      type: Number,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    transaction: {
      type: String,
      enum: ["bankAccount", "cardTopUp", "buyAccount", "adminTopUp", "discountCode"],
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

userHistorySchema.plugin(AutoIncrement, { inc_field: "userHistoryId" });

const UserHistory = mongoose.model(
  "UserHistory",
  userHistorySchema,
);
export default UserHistory;
