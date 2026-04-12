import mongoose from "mongoose";

const accountsHistorySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

const AccountsHistory = mongoose.model(
  "AccountsHistory",
  accountsHistorySchema,
);
export default AccountsHistory;
