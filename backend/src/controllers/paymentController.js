import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import User from "../models/User.js";
import UserHistory from "../models/UserHistory.js";
import BankAccounts from "../models/BankAccounts.js";
import CardTopUp from "../models/CardTopUp.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import Telecom from "../models/Telecom.js";

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
      "-sepay_access_token -bank_active -bank_auto_confirm -createdAt -updatedAt -__v -_id",
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
export const cardTopUpCallback = async (req, res) => {
  try {
    // API đối tác gửi dữ liệu qua Webhook dạng POST JSON (hoặc urlencoded đối với GET)
    const {
      status,
      message,
      request_id,
      declared_value,
      value,
      amount,
      code,
      serial,
      telco,
      trans_id,
      callback_sign,
    } = req.body;

    // 1. Lấy thông tin cấu hình nạp thẻ để lấy partner_key (Mã bí mật)
    const cardTopUpConfig = await CardTopUp.findOne({});
    if (!cardTopUpConfig || !cardTopUpConfig.partner_key) {
      return res
        .status(400)
        .json({ message: "Chưa có cấu hình kết nối thẻ trên hệ thống." });
    }

    // 2. Mã hoá kiểm chứng chữ ký: md5(partner_key + code + serial) theo tài liệu
    const signString = cardTopUpConfig.partner_key + code + serial;
    const expectedSign = crypto
      .createHash("md5")
      .update(signString)
      .digest("hex");

    if (callback_sign !== expectedSign) {
      console.log("[Cảnh báo Fake Callback] Chữ ký không khớp!", req.body);
      return res.status(400).json({ message: "Sai chữ ký bảo mật." });
    }

    // 3. Tìm giao dịch thẻ đã gửi trước đó lên hệ thống qua request_id
    // TODO: (Sắp làm) Khi nạp thẻ từ web, ta lưu vào CardTopUpHistory với mã request_id.
    // Lấy thẻ ra kiểm tra xem "pending" không.

    // 4. Nếu status == 1 hoặc 2: Cộng tiền cho User; Nếu status == 3 hoặc 100: Báo thẻ lỗi.
    // TODO: Cập nhật biến số dư tài khoản người nạp.

    // Phản hồi về HTTP 200 cho bên TheSieuRe biết mình đã xử lý xong để họ không Gửi lại rác nữa
    return res
      .status(200)
      .json({ status: "success", message: "Đã ghi nhận Callback" });
  } catch (error) {
    console.error("Lỗi khi gọi cardTopUpCallback", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
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
      upsert: true,
      runValidators: true,
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

export const readCardTopUpClient = async (req, res) => {
  try {
    const cardTopUpConfig = await CardTopUp.findOne({});
    const discount = cardTopUpConfig ? cardTopUpConfig.discount : 0;
    const telecoms = await Telecom.find({ status: true });

    return res.status(200).json({
      data: {
        discount,
        telecoms,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCardTopUpClient", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Người dùng gửi thẻ cào lên server -> server gửi sang TheSieuRe để check
export const submitCardTopUp = async (req, res) => {
  try {
    const { telco, pin, serial, amount, captcha } = req.body;
    const userId = req.user._id;

    // 0. Xác thực mã captcha
    const captchaToken = req.cookies?.captchaToken;
    if (!captchaToken) {
      return res
        .status(400)
        .json({ message: "Mã captcha đã hết hạn. Vui lòng làm mới captcha." });
    }
    try {
      const decoded = jwt.verify(
        captchaToken,
        process.env.ACCESS_TOKEN_SECRET || "CAPTCHA_SECRET",
      );
      if (decoded.text !== String(captcha)) {
        return res.status(400).json({ message: "Mã captcha không chính xác." });
      }
    } catch {
      return res
        .status(400)
        .json({ message: "Mã captcha không hợp lệ hoặc đã hết hạn." });
    }
    // Xóa cookie captcha sau khi dùng để chống dùng lại
    res.clearCookie("captchaToken");

    // 1. Validate đầu vào
    if (!telco || !pin || !serial || !amount) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin thẻ." });
    }

    // 2. Lấy cấu hình đối tác (partner_id, partner_key)
    const config = await CardTopUp.findOne({});
    if (!config || !config.partner_id || !config.partner_key) {
      return res
        .status(400)
        .json({ message: "Hệ thống chưa cấu hình nạp thẻ. Vui lòng liên hệ Admin." });
    }

    // 3. Tính chiết khấu -> số tiền thực nhận
    const discount = config.discount || 0;
    const amountReceived = Math.round(amount * (1 - discount / 100));

    // 4. Lưu lịch sử nạp thẻ vào DB với trạng thái pending
    const history = await CardTopUpHistory.create({
      userId,
      telco: telco.toUpperCase(),
      amount,
      amount_received: amountReceived,
      pin,
      serial,
      status: "pending",
    });

    // 5. Tạo chữ ký: md5(partner_key + code + serial)
    const sign = crypto
      .createHash("md5")
      .update(config.partner_key + pin + serial)
      .digest("hex");

    // 6. Gửi thẻ sang API TheSieuRe
    const partnerUrl = "https://thesieure.com/chargingws/v2";
    const body = {
      telco: telco.toUpperCase(),
      code: pin,
      serial: serial,
      amount: amount,
      request_id: history._id.toString(),
      partner_id: config.partner_id,
      sign: sign,
      command: "charging",
    };

    const partnerRes = await fetch(partnerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const partnerData = await partnerRes.json();

    console.log("[TheSieuRe Response]", partnerData);

    // 7. Nếu đối tác trả về lỗi ngay lập tức (ví dụ sai partner_id)
    if (partnerData.status && Number(partnerData.status) >= 100) {
      history.status = "failed";
      await history.save();
      return res.status(400).json({
        message: partnerData.message || "Đối tác từ chối thẻ.",
        data: history,
      });
    }

    // 8. Trả về cho Client biết thẻ đang được xử lý
    return res.status(200).json({
      message: "Thẻ đã được gửi đi, đang chờ xử lý.",
      data: history,
    });
  } catch (error) {
    console.error("Lỗi khi gọi submitCardTopUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Telecom
export const createTelecom = async (req, res) => {
  try {
    const data = req.body;
    const telecom = await Telecom.create(data);
    return res.status(200).json({
      message: "Tạo nhà mạng thành công",
      data: telecom,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createTelecom", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readTelecom = async (req, res) => {
  try {
    const telecom = await Telecom.find({});
    return res.status(200).json({
      message: `Lấy danh sách nhà mạng thành công`,
      data: telecom,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readTelecom", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateTelecom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const telecom = await Telecom.findByIdAndUpdate(id, data, {
      new: true,
    });
    return res.status(200).json({
      message: "Cập nhật nhà mạng thành công",
      data: telecom,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateTelecom", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteTelecom = async (req, res) => {
  try {
    const { id } = req.params;
    const telecom = await Telecom.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Xóa nhà mạng thành công",
      data: telecom,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteTelecom", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
