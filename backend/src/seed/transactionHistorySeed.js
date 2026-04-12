import mongoose from "mongoose";
import dotenv from "dotenv";
import TransactionHistory from "../models/TransactionHistory.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

const userId = "6952a3cc2e06a82ffc093c20";

await TransactionHistory.insertMany([
  {
    userId,
    transaction: "banking",
    amount: 100000,
    balance_before: 0,
    balance_after: 100000,
    description: "Chuyển khoản ngân hàng",
  },
  {
    userId,
    transaction: "topUp",
    amount: 50000,
    balance_before: 100000,
    balance_after: 150000,
    description: "Nạp thẻ Viettel",
  },
  {
    userId,
    transaction: "buyAccount",
    amount: 120000,
    balance_before: 150000,
    balance_after: 30000,
    description: "Mua acc Liên Quân #A123",
  },
  {
    userId,
    transaction: "adminTopUp",
    amount: 120000,
    balance_before: 150000,
    balance_after: 30000,
    description: "Admin cộng tiền",
  },
]);

console.log("Seed transaction thành công");
process.exit();
