import mongoose from "mongoose";

const bankAccountsHistorySchema = new mongoose.Schema(
  {
    transaction_id: { type: String, unique: true },
    depositor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number },
    content: { type: String }, // Nội dung CK
    status: { type: String, enum: ["success", "failed"] }, // Trạng thái
  },
  { timestamps: true },
);

const BankAccountsHistory = mongoose.model(
  "BankAccountsHistory",
  bankAccountsHistorySchema,
);
export default BankAccountsHistory;
