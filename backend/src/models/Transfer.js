import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    bank_code: {
      type: String,
      required: true,
    },
    transaction_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transfer = mongoose.model("Transfer", transferSchema);
export default Transfer;
