import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const cardTopUpHistorySchema = new mongoose.Schema(
  {
    cardTopUpHistoryId: {
      type: Number,
      unique: true,
    },
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

cardTopUpHistorySchema.plugin(AutoIncrement, { inc_field: "cardTopUpHistoryId" });

const CardTopUpHistory = mongoose.model(
  "CardTopUpHistory",
  cardTopUpHistorySchema,
);
export default CardTopUpHistory;
