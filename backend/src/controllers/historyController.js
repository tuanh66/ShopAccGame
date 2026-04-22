import AccountsHistory from "../models/AccountsHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import UserHistory from "../models/UserHistory.js";

// Lịch sử mua tài khoản
export const readAccountsHistory = async (req, res) => {};

// Lịch sử chuyển khoản ngân hàng
export const readBankAccountsHistory = async (req, res) => {
  try {
    const bankAccountsHistory = await BankAccountsHistory.find()
      .populate("depositor", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy lịch sử ngân hàng thành công",
      data: bankAccountsHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readBankAccountsHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử nạp thẻ cào
export const readCardTopUpHistory = async (req, res) => {
  try {
    const cardTopUpHistory = await CardTopUpHistory.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy lịch sử nạp thẻ thành công",
      data: cardTopUpHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCardTopUpHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
