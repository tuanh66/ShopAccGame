import Accounts from "../models/Accounts.js";
import AccountsHistory from "../models/AccountsHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import UserHistory from "../models/UserHistory.js";
import RandomAccountsHistory from "../models/RandomAccountsHistory.js";
import RandomAccounts from "../models/RandomAccounts.js";
import RandomCategories from "../models/RandomCategories.js";

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

// Lịch sử mua random account (Admin)
export const readRandomAccountsBoughtHistoryAdmin = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (search && !isNaN(search)) {
      filter.historyRandomAccountsId = Number(search);
    }

    const total = await RandomAccountsHistory.countDocuments(filter);
    const histories = await RandomAccountsHistory.find(filter)
      .populate("userId", "username -_id")
      .populate("accountId", "username -_id")
      .populate("categoriesId", "name -_id")
      .select("-__v -_id")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const cleanedData = histories.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        historyAccountId: obj.historyRandomAccountsId, // Map to match frontend
        buyerName: obj.userId?.username,
        gameUsername: obj.accountId?.username,
        categoryName: obj.categoriesId?.name,
        userId: undefined,
        accountId: undefined,
        categoriesId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử mua random account thành công",
      data: cleanedData,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomAccountsBoughtHistoryAdmin", error);
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

// Lịch sử mua tài khoản (Client - Gộp cả nick thường và random)
export const readAccountsBoughtHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Lấy lịch sử từ bảng AccountsHistory (Nick thường)
    const standardHistory = await AccountsHistory.find({ userId })
      .populate({
        path: "accountId",
        select: "accountsId price price_sale avatar attributes",
      })
      .populate("categoriesId", "name slug");

    // 2. Lấy lịch sử từ bảng RandomAccountsHistory (Nick random)
    const randomHistory = await RandomAccountsHistory.find({ userId })
      .populate({
        path: "accountId",
        select: "randomAccountsId username tier image",
      })
      .populate("categoriesId", "name slug");

    // 3. Chuẩn hóa dữ liệu về cùng một cấu trúc lồng nhau để khớp với Frontend
    const formattedStandard = standardHistory.map((item) => ({
      _id: item._id,
      accountId: {
        accountsId: item.accountId?.accountsId,
        avatar: item.accountId?.avatar,
      },
      categoriesId: {
        name: item.categoriesId?.name,
        slug: item.categoriesId?.slug,
      },
      price: item.price,
      status: item.status,
      passwordStatus: item.passwordStatus,
      createdAt: item.createdAt,
      isRandom: false,
    }));

    const formattedRandom = randomHistory.map((item) => ({
      _id: item._id,
      accountId: {
        accountsId: item.accountId?.randomAccountsId, // Dùng chung key accountsId để frontend không phải sửa
        avatar: item.accountId?.image?.[0] || "",
      },
      categoriesId: {
        name: item.categoriesId?.name,
        slug: item.categoriesId?.slug,
      },
      price: item.price,
      status: item.status,
      passwordStatus: item.passwordStatus,
      createdAt: item.createdAt,
      isRandom: true,
    }));

    // 4. Gộp và sắp xếp theo ngày mua mới nhất
    const combinedHistory = [...formattedStandard, ...formattedRandom].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return res.status(200).json({
      message: "Lấy lịch sử tài khoản đã mua thành công",
      data: combinedHistory,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readAccountsBoughtHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readAccountsBoughtHistoryById = async (req, res) => {
  try {
    const { id } = req.params; // accountsId hoặc randomAccountsId
    const userId = req.user._id;
    const isRandomQuery = req.query.isRandom === "true";

    let account;
    let history;
    let isRandom = false;

    // 1. Nếu query báo là random, hoặc thử tìm random trước (nếu không có query)
    if (isRandomQuery) {
      account = await RandomAccounts.findOne({ randomAccountsId: id });
      if (account) {
        history = await RandomAccountsHistory.findOne({
          userId,
          accountId: account._id,
        }).populate("categoriesId", "name slug");
        isRandom = true;
      }
    } else {
      // 2. Mặc định hoặc query báo là nick thường
      account = await Accounts.findOne({ accountsId: id });
      if (account) {
        history = await AccountsHistory.findOne({
          userId,
          accountId: account._id,
        }).populate("categoriesId", "name slug attributes");
      }
    }

    // Fallback: Nếu tìm theo hướng chỉ định không thấy, thử hướng còn lại (đề phòng link cũ)
    if (!history) {
      if (!isRandomQuery) {
        account = await RandomAccounts.findOne({ randomAccountsId: id });
        if (account) {
          history = await RandomAccountsHistory.findOne({
            userId,
            accountId: account._id,
          }).populate("categoriesId", "name slug");
          isRandom = true;
        }
      } else {
        account = await Accounts.findOne({ accountsId: id });
        if (account) {
          history = await AccountsHistory.findOne({
            userId,
            accountId: account._id,
          }).populate("categoriesId", "name slug attributes");
          isRandom = false;
        }
      }
    }

    if (!history) {
      return res.status(404).json({
        message: "Không tìm thấy lịch sử mua hoặc bạn không có quyền xem",
      });
    }

    // 3. Làm đẹp attributes
    let enrichedAttributes = [];
    if (!isRandom) {
      enrichedAttributes = Object.entries(account.attributes || {}).map(
        ([key, value]) => {
          const config = history.categoriesId?.attributes?.[key];
          return { label: config?.label || key, value };
        },
      );
    } else {
      // Đối với nick random: Không trả về Tier để bảo mật, để mảng rỗng
      enrichedAttributes = [];
    }

    const data = {
      ...account.toObject(),
      accountsId: isRandom ? account.randomAccountsId : account.accountsId,
      attributes: enrichedAttributes,
      categoryName: history.categoriesId?.name,
      historyAccountId: isRandom
        ? history.historyRandomAccountsId
        : history.historyAccountId,
      createdAt: history.createdAt,
      passwordStatus: history.passwordStatus,
      status: history.status,
      updatedAt: history.updatedAt,
      isRandom,
    };

    if (!history.passwordStatus) {
      data.username = "********";
      data.password = "********";
      if (!isRandom) {
        data.attributes = [];
        data.image = [];
      }
    } else if (isRandom) {
      try {
        const { decrypt } = await import("../libs/encryption.js");
        data.password = decrypt(account.password);
      } catch (e) {
        console.error("Lỗi giải mã mật khẩu random:", e);
      }
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
    const { id } = req.params;
    const userId = req.user._id;
    const isRandomQuery = req.query.isRandom === "true";

    let history;
    let accountData;
    let isRandom = false;

    // Ưu tiên theo tham số truyền lên
    if (isRandomQuery) {
      const accountRandom = await RandomAccounts.findOne({
        randomAccountsId: id,
      });
      if (accountRandom) {
        history = await RandomAccountsHistory.findOneAndUpdate(
          { userId, accountId: accountRandom._id },
          { $set: { passwordStatus: true } },
          { new: true },
        ).populate("categoriesId");
        if (history) {
          isRandom = true;
          const { decrypt } = await import("../libs/encryption.js");
          accountData = accountRandom.toObject();
          accountData.password = decrypt(accountRandom.password);
          accountData.accountsId = accountRandom.randomAccountsId;
        }
      }
    }

    // Nếu chưa tìm thấy (hoặc không phải random), tìm nick thường
    if (!history && !isRandomQuery) {
      const accountStandard = await Accounts.findOne({ accountsId: id });
      if (accountStandard) {
        history = await AccountsHistory.findOneAndUpdate(
          { userId, accountId: accountStandard._id },
          { $set: { passwordStatus: true } },
          { new: true },
        ).populate("categoriesId");
        if (history) {
          accountData = accountStandard.toObject();
          accountData.accountsId = accountStandard.accountsId;
        }
      }
    }

    if (!history) {
      return res.status(403).json({ message: "Cập nhật thất bại" });
    }

    if (isRandom) {
      return res.status(200).json({
        message: "Lấy thông tin tài khoản thành công",
        data: {
          ...accountData,
          categoryName: history.categoriesId?.name,
          historyAccountId: history.historyRandomAccountsId,
          createdAt: history.createdAt,
          passwordStatus: true,
          status: history.status,
          updatedAt: history.updatedAt,
          isRandom: true,
          attributes: [], // Ẩn thông tin loại tài khoản
        },
      });
    }

    const enrichedAttributes = Object.entries(accountData.attributes || {}).map(
      ([key, value]) => {
        const config = history.categoriesId?.attributes?.[key];
        return { label: config?.label || key, value };
      },
    );

    return res.status(200).json({
      message: "Lấy thông tin tài khoản thành công",
      data: {
        ...accountData,
        attributes: enrichedAttributes,
        categoryName: history.categoriesId?.name,
        historyAccountId: history.historyAccountId,
        createdAt: history.createdAt,
        passwordStatus: true,
        status: history.status,
        updatedAt: history.updatedAt,
        isRandom: false,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi updatePasswordStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
