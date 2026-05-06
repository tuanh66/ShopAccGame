import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const accountsHistorySchema = new mongoose.Schema(
  {
    historyAccountId: {
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
    price: {
      type: Number,
      required: true,
    },
    passwordStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true },
);

const AccountsHistory = mongoose.model(
  "AccountsHistory",
  accountsHistorySchema,
);
accountsHistorySchema.plugin(AutoIncrement, {
  inc_field: "historyAccountId",
});
export default AccountsHistory;
