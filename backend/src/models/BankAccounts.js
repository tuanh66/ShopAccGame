import mongoose from "mongoose";

const bankAccountsSchema = new mongoose.Schema(
  {
    bank_name: {
      type: String,
      required: true,
    },
    account_number: {
      type: String,
      required: true,
    },
    bank_account_name: {
      type: String,
      required: true,
    },
    bank_branch: {
      type: String,
      required: true,
    },
    bank_syntax: {
      type: String,
      required: true,
    },
    bank_note: {
      type: String,
      required: true,
    },
    sepay_access_token: {
      type: String,
      required: true,
    },
    bank_active: {
      type: Boolean,
      default: false,
    },
    bank_auto_confirm: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const BankAccounts = mongoose.model("BankAccounts", bankAccountsSchema);
export default BankAccounts;
