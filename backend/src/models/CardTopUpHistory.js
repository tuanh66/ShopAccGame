import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const cardTopUpHistorySchema = new mongoose.Schema(
  {
    historyId: {
      type: Number,
      unique: true,
    },
    partner: { 
      type: String, 
      required: true,
      enum: ["viettel", "mobifone", "vinaphone"],
    },
    serial: { 
      type: String, 
      required: true,
      trim: true,
    },
    pin: { 
      type: String, 
      required: true,
      trim: true,
    },
    amount: { 
      type: Number, 
      required: true,
      min: 0,
    },
    status: { 
      type: String, 
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    message: { 
      type: String, 
      trim: true,
    },
  },
  { timestamps: true },
);

cardTopUpHistorySchema.plugin(AutoIncrement, { inc_field: "historyId" });

const CardTopUpHistory = mongoose.model("CardTopUpHistory", cardTopUpHistorySchema);
export default CardTopUpHistory;