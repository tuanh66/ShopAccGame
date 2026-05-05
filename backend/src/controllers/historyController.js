import Accounts from "../models/Accounts.js";
import AccountsHistory from "../models/AccountsHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import UserHistory from "../models/UserHistory.js";

// Lịch sử chuyển khoản ngân hàng
export const readBankAccountsHistory = async (req, res) => {
  try {
    const bankAccountsHistory = await BankAccountsHistory.find()
      .populate("depositor", "username")
      .select(
        "bankAccountsHistoryId transaction_id amount content status createdAt depositor -_id",
      )
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

// Lịch sử sử dụng mã giảm giá
export const readDiscountCodeHistory = async (req, res) => {
  try {
    const discountCodeHistory = await DiscountCodeHistory.find()
      .populate("user", "username")
      .select(
        "-__v -_id",
      )
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy lịch sử mã giảm giá thành công",
      data: discountCodeHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readDiscountCodeHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử giao dịch người dùng
export const readUserTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const userTransactionHistory = await UserHistory.find({
      userId,
      transaction: { $in: ["bankAccount", "buyAccount", "cardTopUp"] },
    })
      .select("-balance_after -balance_before -description -updatedAt -userId -__v -_id")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy lịch sử giao dịch thành công",
      data: userTransactionHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readUserTransactionHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy chi tiết một giao dịch theo userHistoryId
export const readUserTransactionHistoryById = async (req, res) => {
  try {
    const { userHistoryId } = req.params;
    const userId = req.user._id;

    const transaction = await UserHistory.findOne({
      userId,
      userHistoryId,
    }).select(
      "-__v -_id -updatedAt -balance_before -userId",
    );

    if (!transaction) {
      return res.status(404).json({ message: "Không tìm thấy giao dịch" });
    }

    return res.status(200).json({
      message: "Lấy chi tiết giao dịch thành công",
      data: transaction,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readUserTransactionHistoryById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử mua tài khoản
export const readAccountsBoughtHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy lịch sử từ bảng AccountsHistory
    const accountsBoughtHistory = await AccountsHistory.find({ userId })
      .populate({
        path: "accountId",
        select: "accountsId price price_sale avatar attributes", // Lấy các thông tin cần hiển thị
      })
      .populate("categoriesId", "name slug")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy lịch sử tài khoản đã mua thành công",
      data: accountsBoughtHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountsBoughtHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
