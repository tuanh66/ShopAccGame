import mongoose from "mongoose";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import User from "../models/User.js";
import UserHistory from "../models/UserHistory.js";
import BankAccounts from "../models/BankAccounts.js";

// Chuyển khoản ngân hàng
export const sepayWebhook = async (req, res) => {
  // Bật session để đảm bảo nếu lỗi thì hoàn tác không cộng lẻ tiền
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // SePay gửi data về qua POST body
    const id = req.body.id;
    const transactionContent =
      req.body.content || req.body.transactionContent || "";
    const amountIn = req.body.transferAmount || req.body.amountIn;
    const gateway = req.body.gateway || "";

    // 1. Kiểm tra các tham số bắt buộc
    if (!id || amountIn === undefined) {
      throw new Error("Dữ liệu webhook không hợp lệ");
    }

    // 1.5 Kiểm tra Bảo mật API KEY (nếu có cấu hình)
    const bankConfig = await BankAccounts.findOne({});
    if (bankConfig && bankConfig.sepay_access_token) {
      const authHeader = req.headers["authorization"];
      const expectedAuth = `Apikey ${bankConfig.sepay_access_token}`;

      if (!authHeader || authHeader !== expectedAuth) {
        throw new Error("Xác thực Webhook thất bại!");
      }
    }

    // 2. Chống lặp (Idempotency): Kiểm tra ID giao dịch này đã được xử lý chưa
    const existingTransfer = await BankAccountsHistory.findOne({
      transaction_id: id,
    }).session(session);
    if (existingTransfer) {
      // Đã xử lý rồi -> Báo lại OK cho SePay để nó không spam gửi lại nữa
      await session.abortTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ success: true, message: "Transaction already processed" });
    }

    // 3. Phân tích nội dung chuyển khoản tìm UserID (Cú pháp: NAP SHOPT1 <USER_ID>)
    // Biến cấu hình tiền tố có thể lấy từ DB nếu có, không thì mặc định
    const prefix =
      bankConfig?.bank_syntax || process.env.BANK_PREFIX || "NAP SHOPT1";

    // Tạo Regex bỏ qua khoảng trắng thừa, ví dụ: "NAP   SHOPT1   123" -> match "123"
    const regexPattern = new RegExp(`${prefix}\\s*(\\d+)`, "i");
    const match = transactionContent
      ? transactionContent.match(regexPattern)
      : null;

    if (!match) {
      // Nội dung không đúng cú pháp, ghi log lại nhưng không cộng tiền cho ai
      await BankAccountsHistory.create(
        [
          {
            transaction_id: id,
            amount: Number(amountIn),
            content: transactionContent || "Không có nội dung",
            status: "failed",
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        success: true,
        message: "Cú pháp không hợp lệ, đã ghi nhận nạp thủ công.",
      });
    }

    const userIdSeq = match[1];

    // 4. Tìm User. Do userId của bạn trong Schema là Number, ta dùng findOne.
    const user = await User.findOne({ userId: Number(userIdSeq) }).session(
      session,
    );

    if (!user) {
      // Người dùng không tồn tại
      await BankAccountsHistory.create(
        [
          {
            transaction_id: id,
            amount: Number(amountIn),
            content: transactionContent,
            status: "failed",
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();
      return res
        .status(200)
        .json({ success: true, message: "User không tồn tại" });
    }

    // 5. Cộng tiền
    const amountNum = Number(amountIn);
    const balance_before = user.balance;
    const balance_after = balance_before + amountNum;

    user.balance = balance_after;
    user.maxBalance += amountNum; // Cộng dồn tổng tiền đã nạp
    await user.save({ session });

    // 6. Ghi lại Transfer
    await BankAccountsHistory.create(
      [
        {
          transaction_id: id,
          amount: amountNum,
          content: transactionContent,
          depositor: user._id,
          status: "success",
        },
      ],
      { session },
    );

    // 7. Ghi lại Transaction History
    await UserHistory.create(
      [
        {
          userId: user._id,
          transaction: "bankAccount",
          amount: amountNum,
          balance_before: balance_before,
          balance_after: balance_after,
          description: `Nạp tiền tự động qua bank (${gateway}) - ID: ${id}`,
        },
      ],
      { session },
    );

    // 8. Chốt giao dịch thành công toàn bộ
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .json({ success: true, message: "Nạp tiền thành công" });
  } catch (error) {
    console.error("[SEPAY WEBHOOK ERROR]", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createBankAccounts = async (req, res) => {
  try {
    const data = req.body;

    // Chèn hoặc cập nhật bản ghi đầu tiên (Upsert pattern)
    // findOneAndUpdate với điều kiện {} (lấy cái đầu tiên nó tìm thấy)
    const bankAccount = await BankAccounts.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });

    return res.status(200).json({
      message: "Lưu cấu hình ngân hàng thành công",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createBankAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readBankAccounts = async (req, res) => {
  try {
    const bankAccount = await BankAccounts.findOne({});

    if (!bankAccount) {
      return res.status(200).json({
        message: "Chưa có cấu hình ngân hàng",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Lấy cấu hình ngân hàng thành công",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readBankAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateBankAccounts = async (req, res) => {
  try {
    const data = req.body;
    const bankAccount = await BankAccounts.findOneAndUpdate({}, data, {
      new: true,
    });
    return res.status(200).json({
      message: "Cập nhật cấu hình ngân hàng thành công",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateBankAccounts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readBankAccountsClient = async (req, res) => {
  try {
    // Dùng select("-tên_trường") để ẩn các trường cấu hình nội bộ khỏi con mắt của user/Client
    const bankAccount = await BankAccounts.findOne({}).select(
      "-sepay_access_token -bank_active -bank_auto_confirm"
    );
    if (!bankAccount) {
      return res.status(200).json({
        message: "Chưa có cấu hình ngân hàng",
        data: null,
      });
    }
    return res.status(200).json({
      message: "Lấy cấu hình ngân hàng thành công",
      data: bankAccount,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readBankAccountsClient", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Nạp thẻ cào
export const cardTopUpWebhook = async (req, res) => {
  try {
  } catch (error) {}
};

export const createCardTopUp = async (req, res) => {
  try {
    const data = req.body;

    // Chèn hoặc cập nhật bản ghi đầu tiên (Upsert pattern)
    // findOneAndUpdate với điều kiện {} (lấy cái đầu tiên nó tìm thấy)
    const cardTopUp = await CardTopUp.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return res.status(200).json({
      message: "Tạo thẻ cào thành công",
      data: cardTopUp,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createCardTopUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readCardTopUp = async (req, res) => {
  try {
    const cardTopUp = await CardTopUp.findOne({});

    if (!cardTopUp) {
      return res.status(200).json({
        message: "Chưa có cấu hình thẻ cào",
        data: null,
      });
    }
    return res.status(200).json({
      message: "Lấy thẻ cào thành công",
      data: cardTopUp,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCardTopUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateCardTopUp = async (req, res) => {
  try {
    const data = req.body;
    const cardTopUp = await CardTopUp.findOneAndUpdate({}, data, {
      new: true,
    });
    return res.status(200).json({
      message: "Cập nhật thẻ cào thành công",
      data: cardTopUp,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateCardTopUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
