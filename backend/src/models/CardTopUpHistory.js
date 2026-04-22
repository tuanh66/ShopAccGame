import mongoose from "mongoose";

const cardTopUpHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    telco: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    amount_received: {
      type: Number,
      required: true,
      min: 0,
    },
    pin: {
      type: String,
      required: true,
      trim: true,
    },
    serial: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const CardTopUpHistory = mongoose.model(
  "CardTopUpHistory",
  cardTopUpHistorySchema,
);
export default CardTopUpHistory;
