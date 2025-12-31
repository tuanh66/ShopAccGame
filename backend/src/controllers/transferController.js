import axios from "axios";
import Transfer from "../models/Transfer.js";
import User from "../models/User.js";

export const getTransferHistory = async (req, res) => {
  try {
    const response = await axios.get(
      "https://my.sepay.vn/userapi/transactions/list",
      {
        headers: {
          Authorization: `Bearer ${process.env.SEPAY_API_KEY}`,
        },
      }
    );

    const data = response.data;

    if (!data.transactions) {
      return res.status(400).json({ message: "Không lấy được giao dịch" });
    }

    for (const tx of data.transactions) {
      // Nếu trùng transaction_id -> bỏ qua
      const exists = await Transfer.findOne({ transaction_id: tx.id });
      if (exists) continue;

      // Chỉ xử lý account number cần theo dõi
      if (tx.account_number !== "0002135238747") continue;

      // Tách userId từ transaction content
      const match = tx.transaction_content.match(
        /NAP\s*SHOPTP[\s\.\-\_]*([0-9]+)/i
      );
      if (!match) continue;

      const userId = match[1];
      const amount = parseFloat(tx.amount_in);
      const description = `NAP SHOPTP ${userId}`;

      // Lưu vào DB
      const transaction = await Transfer.create({
        transaction_id: tx.id,
        amount,
        description,
        bank_code: tx.bank_brand_name,
        transaction_date: new Date(tx.transaction_date),
      });

      // Auto nạp tiền
      await autoTopup(userId, amount);
    }

    return res.status(200).json({
      message: "OK",
      transactions: data.transactions,
    });
  } catch (error) {
    if (error.response) {
      // lỗi từ server SePay
      return res
        .status(error.response.status)
        .json({ message: error.response.data.message });
    } else {
      // lỗi khác (mạng, timeout...)
      return res.status(500).json({ message: "Lỗi hệ thống" });
    }
  }
};

// Hàm auto nạp tiền
const autoTopup = async (userId, amount) => {
  const user = await User.findOne({ userId: parseInt(userId) });
  if (user) {
    user.balance += amount;
    await user.save();
  }
};
