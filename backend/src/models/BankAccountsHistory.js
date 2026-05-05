import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const bankAccountsHistorySchema = new mongoose.Schema(
  {
    bankAccountsHistoryId: {
      type: Number,
      unique: true,
    },
    transaction_id: { type: String, unique: true },
    depositor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number },
    content: { type: String }, // Nội dung CK
    status: { type: String, enum: ["success", "failed"] }, // Trạng thái
  },
  { timestamps: true },
);

bankAccountsHistorySchema.plugin(AutoIncrement, {
  inc_field: "bankAccountsHistoryId",
});

const BankAccountsHistory = mongoose.model(
  "BankAccountsHistory",
  bankAccountsHistorySchema,
);
export default BankAccountsHistory;
