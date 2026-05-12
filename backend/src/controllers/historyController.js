import Accounts from "../models/Accounts.js";
import AccountsHistory from "../models/AccountsHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import UserHistory from "../models/UserHistory.js";

// Admin
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
      .select("-__v -_id")
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

// Lịch sử mua tài khoản (Admin)
export const readAccountsBoughtHistoryAdmin = async (req, res) => {
  try {
    const { search, status, passwordStatus, page = 1, limit = 10 } = req.query;
    const filter = {};

    // 1. Lọc theo trạng thái giao dịch
    if (status !== undefined && status !== "") {
      filter.status = status === "true";
    }

    // 2. Lọc theo trạng thái lấy mật khẩu
    if (passwordStatus !== undefined && passwordStatus !== "") {
      filter.passwordStatus = passwordStatus === "true";
    }

    // 3. Tìm kiếm theo ID lịch sử (số)
    if (search && !isNaN(search)) {
      filter.historyAccountId = Number(search);
    }

    // 4. Tìm kiếm nâng cao (phải dùng aggregate hoặc populate match nếu muốn tìm theo username người mua)
    // Để đơn giản, ở đây mình xử lý lọc cơ bản. 
    // Nếu bạn muốn tìm theo username, chúng ta sẽ cần dùng $lookup (aggregate).

    const total = await AccountsHistory.countDocuments(filter);
    const histories = await AccountsHistory.find(filter)
      .populate("userId", "username -_id")
      .populate("accountId", "username -_id")
      .populate("categoriesId", "name -_id")
      .select("-__v -_id")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Phẳng hóa dữ liệu: Đưa giá trị bên trong ra ngoài
    const cleanedData = histories.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        buyerName: obj.userId?.username, // Tên người mua
        gameUsername: obj.accountId?.username, // Tên nick game
        categoryName: obj.categoriesId?.name, // Tên danh mục
        userId: undefined, // Xóa đối tượng cũ
        accountId: undefined,
        categoriesId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử mua tài khoản thành công",
      data: cleanedData,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountsBoughtHistoryAdmin", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Client
// Lịch sử giao dịch người dùng
export const readUserTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const userTransactionHistory = await UserHistory.find({
      userId,
      transaction: { $in: ["bankAccount", "buyAccount", "cardTopUp"] },
    })
      .select(
        "-balance_after -balance_before -description -updatedAt -userId -__v -_id",
      )
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
    }).select("-__v -_id -updatedAt -balance_before -userId");

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

export const readAccountsBoughtHistoryById = async (req, res) => {
  try {
    const { id } = req.params; // accountsId (số)
    const userId = req.user._id;

    // 1. Tìm thông tin lịch sử mua trước để kiểm tra quyền sở hữu và passwordStatus
    // Chúng ta cần tìm AccountId tương ứng với accountsId (số) trước
    const account = await Accounts.findOne({ accountsId: id });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    const history = await AccountsHistory.findOne({
      userId,
      accountId: account._id,
    }).populate("categoriesId", "name slug attributes");

    if (!history) {
      return res.status(403).json({
        message: "Bạn không có quyền xem thông tin tài khoản này",
      });
    }

    // 2. Làm đẹp attributes
    const enrichedAttributes = Object.entries(account.attributes || {}).map(
      ([key, value]) => {
        const config = history.categoriesId?.attributes?.[key];
        return {
          label: config?.label || key,
          value: value,
        };
      },
    );

    // 3. Chuẩn bị dữ liệu sạch trả về cho Client
    const data = {
      ...account.toObject(),
      attributes: enrichedAttributes,
      categoryName: history.categoriesId?.name,
      historyAccountId: history.historyAccountId,
      createdAt: history.createdAt, // Ngày mua (lấy từ lịch sử)
      passwordStatus: history.passwordStatus,
      status: history.status, // Trạng thái giao dịch (Boolean)
      updatedAt: history.updatedAt, // Thời gian lấy mật khẩu
    };

    // Xóa tất cả các trường "rác" hoặc ID nội bộ
    delete data._id;
    delete data.__v;
    delete data.categories_id;
    delete data.note;
    delete data.avatar;

    // Đảm bảo không còn dấu vết của ngày tạo nick cũ
    // (createdAt ở trên đã bị ghi đè bởi history.createdAt)

    if (!history.passwordStatus) {
      data.username = "********";
      data.password = "********";
      data.image = [];
      data.attributes = [];
    }

    return res.status(200).json({
      message: "Lấy chi tiết tài khoản thành công",
      data,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountsBoughtHistoryById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updatePasswordStatus = async (req, res) => {
  try {
    const { id } = req.params; // accountsId
    const userId = req.user._id;

    // 1. Tìm tài khoản gốc
    const account = await Accounts.findOne({ accountsId: id });
    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    // 2. Cập nhật trạng thái trong lịch sử và lấy thông tin category để format attributes
    const history = await AccountsHistory.findOneAndUpdate(
      { userId, accountId: account._id },
      { $set: { passwordStatus: true } },
      { new: true },
    ).populate("categoriesId");

    if (!history) {
      return res.status(403).json({ message: "Cập nhật thất bại" });
    }

    // 3. Format lại attributes để trả về cho Client
    const enrichedAttributes = Object.entries(account.attributes || {}).map(
      ([key, value]) => {
        const config = history.categoriesId?.attributes?.[key];
        return {
          label: config?.label || key,
          value: value,
        };
      },
    );

    // 4. Trả về đầy đủ dữ liệu để Frontend hiển thị ngay (Ảnh, thuộc tính, pass...)
    return res.status(200).json({
      message: "Lấy thông tin tài khoản thành công",
      data: {
        ...account.toObject(),
        attributes: enrichedAttributes,
        categoryName: history.categoriesId?.name,
        historyAccountId: history.historyAccountId,
        purchaseDate: history.createdAt,
        passwordStatus: true,
        status: history.status, // Trạng thái giao dịch
        updatedAt: history.updatedAt,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi updatePasswordStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
