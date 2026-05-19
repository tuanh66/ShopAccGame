import Accounts from "../models/Accounts.js";
import AccountsHistory from "../models/AccountsHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import UserHistory from "../models/UserHistory.js";
import RandomAccountsHistory from "../models/RandomAccountsHistory.js";
import RandomAccounts from "../models/RandomAccounts.js";
import RandomCategories from "../models/RandomCategories.js";

// Lịch sử giao dịch (Admin)
export const readUserTransactionHistoryAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const today = req.query.today === "true";
    const skip = (page - 1) * limit;

    let filter = {};

    if (today) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $gte: startOfToday,
        $lte: endOfToday,
      };
    }

    // Xử lý tìm kiếm đa năng
    if (search) {
      const searchRegex = new RegExp(search, "i");

      // 1. Tìm các User có username khớp với search
      const Users = await import("../models/User.js").then((m) => m.default);
      const matchingUsers = await Users.find({
        username: searchRegex,
      }).select("_id");
      const userIds = matchingUsers.map((u) => u._id);

      // 2. Tạo filter tổng hợp
      filter.$or = [
        { transaction: searchRegex },
        { description: searchRegex },
        { userId: { $in: userIds } },
      ];

      // Nếu search là số, tìm thêm theo ID lịch sử, số tiền và số dư
      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ userHistoryId: num });
        filter.$or.push({ amount: num });
        filter.$or.push({ balance_before: num });
        filter.$or.push({ balance_after: num });
      }
    }

    const total = await UserHistory.countDocuments(filter);
    const transactions = await UserHistory.find(filter)
      .populate("userId", "username")
      .select("-_id -__v -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Định dạng lại dữ liệu trước khi trả về
    const formattedTransactions = transactions.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        username: doc.userId?.username || "N/A",
        userId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy toàn bộ lịch sử giao dịch thành công",
      data: formattedTransactions,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readUserTransactionHistoryAdmin", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử mua tài khoản (Admin)
export const readAccountsBoughtHistoryAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Tìm các User, Accounts, Categories khớp
      const [users, accounts, categories] = await Promise.all([
        import("../models/User.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
        import("../models/Accounts.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
        import("../models/Categories.js").then((m) =>
          m.default.find({ name: searchRegex }).select("_id"),
        ),
      ]);

      filter.$or = [
        { userId: { $in: users.map((u) => u._id) } },
        { accountId: { $in: accounts.map((a) => a._id) } },
        { categoriesId: { $in: categories.map((c) => c._id) } },
      ];

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ historyAccountId: num });
        filter.$or.push({ price: num }); // Thêm tìm kiếm theo giá
      }
    }

    const total = await AccountsHistory.countDocuments(filter);
    const transaction = await AccountsHistory.find(filter)
      .populate("userId", "username")
      .populate("accountId", "username")
      .populate("categoriesId", "name")
      .select("-_id -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransaction = transaction.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        userName: doc.userId?.username || "N/A",
        accountName: doc.accountId?.username || "N/A",
        categoryName: doc.categoriesId?.name || "N/A",
        userId: undefined,
        accountId: undefined,
        categoriesId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử mua tài khoản thành công",
      data: formattedTransaction,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Tìm các User, Accounts, Categories khớp
      const [users, accounts, categories] = await Promise.all([
        import("../models/User.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
        import("../models/RandomAccounts.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
        import("../models/RandomCategories.js").then((m) =>
          m.default.find({ name: searchRegex }).select("_id"),
        ),
      ]);

      filter.$or = [
        { userId: { $in: users.map((u) => u._id) } },
        { accountId: { $in: accounts.map((a) => a._id) } },
        { categoriesId: { $in: categories.map((c) => c._id) } },
      ];

      // Ánh xạ từ tiếng Việt sang database cho field tier
      const lowerSearch = search.toLowerCase();
      if ("thường".includes(lowerSearch) || "thuong".includes(lowerSearch)) {
        filter.$or.push({ tier: "thuong" });
      }
      if ("ngon".includes(lowerSearch)) {
        filter.$or.push({ tier: "ngon" });
      }
      if (
        "siêu phẩm".includes(lowerSearch) ||
        "sieu pham".includes(lowerSearch) ||
        "siêu".includes(lowerSearch)
      ) {
        filter.$or.push({ tier: "sieuPham" });
      }

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ historyRandomAccountsId: num });
        filter.$or.push({ price: num }); // Thêm tìm kiếm theo giá
      }
    }

    const total = await RandomAccountsHistory.countDocuments(filter);
    const transaction = await RandomAccountsHistory.find(filter)
      .populate("userId", "username")
      .populate("accountId", "username")
      .populate("categoriesId", "name")
      .select("-_id -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransaction = transaction.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        userName: doc.userId?.username || "N/A",
        accountName: doc.accountId?.username || "N/A",
        categoryName: doc.categoriesId?.name || "N/A",
        userId: undefined,
        accountId: undefined,
        categoriesId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử mua tài khoản thành công",
      data: formattedTransaction,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readRandomAccountsBoughtHistoryAdmin", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử chuyển khoản ngân hàng
export const readBankAccountsHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      const [users] = await Promise.all([
        import("../models/User.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
      ]);

      filter.$or = [
        { transaction_id: searchRegex },
        { content: searchRegex },
        { depositor: { $in: users.map((u) => u._id) } },
      ];

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ bankAccountsHistoryId: num });
        filter.$or.push({ amount: num });
      }
    }

    const total = await BankAccountsHistory.countDocuments(filter);
    const transaction = await BankAccountsHistory.find(filter)
      .populate("depositor", "username")
      .select("-_id -__v -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransaction = transaction.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        userName: doc.depositor?.username || "N/A",
        depositor: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử chuyển khoản thành công",
      data: formattedTransaction,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readBankAccountsHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử nạp thẻ cào
export const readCardTopUpHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      const [users] = await Promise.all([
        import("../models/User.js").then((m) =>
          m.default.find({ username: searchRegex }).select("_id"),
        ),
      ]);

      filter.$or = [
        { content: searchRegex },
        { userId: { $in: users.map((u) => u._id) } },
      ];

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ cardTopUpHistoryId: num });
        filter.$or.push({ amount: num });
      }
    }

    const total = await CardTopUpHistory.countDocuments(filter);
    const transaction = await CardTopUpHistory.find(filter)
      .populate("userId", "username")
      .select("-_id -__v -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransaction = transaction.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        userName: doc.userId?.username || "N/A",
        userId: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử nạp thẻ thành công",
      data: formattedTransaction,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readCardTopUpHistory", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lịch sử sử dụng mã giảm giá
export const readDiscountCodeHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
      const searchRegex = new RegExp(search, "i");

      // Tìm User sử dụng mã
      const Users = await import("../models/User.js").then((m) =>
        m.default.find({ username: searchRegex }).select("_id"),
      );

      filter.$or = [
        { code: searchRegex },
        { user: { $in: Users.map((u) => u._id) } },
      ];

      // Ánh xạ từ tiếng Việt sang database cho field type (Loại mã) và applyFor (Áp dụng cho)
      const lowerSearch = search.toLowerCase();
      
      // Mapping Type
      if ("phần trăm".includes(lowerSearch) || "phan tram".includes(lowerSearch)) {
        filter.$or.push({ type: "percent" });
      }
      if ("cố định".includes(lowerSearch) || "co dinh".includes(lowerSearch)) {
        filter.$or.push({ type: "fixed" });
      }

      // Mapping ApplyFor
      if ("tất cả".includes(lowerSearch) || "tat ca".includes(lowerSearch)) {
        filter.$or.push({ applyFor: "all" });
      }
      if ("tài khoản".includes(lowerSearch) || "tai khoan".includes(lowerSearch)) {
        filter.$or.push({ applyFor: "account" });
      }
      if ("random".includes(lowerSearch)) {
        filter.$or.push({ applyFor: "random" });
      }

      if (!isNaN(search)) {
        const num = parseInt(search);
        filter.$or.push({ discountCodeHistoryId: num });
        filter.$or.push({ discountAmount: num });
        filter.$or.push({ originalPrice: num });
        filter.$or.push({ finalPrice: num });
      }
    }

    const total = await DiscountCodeHistory.countDocuments(filter);
    const transaction = await DiscountCodeHistory.find(filter)
      .populate("user", "username")
      .select("-_id -__v -updatedAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTransaction = transaction.map((item) => {
      const doc = item.toObject();
      return {
        ...doc,
        userName: doc.user?.username || "N/A",
        user: undefined,
      };
    });

    return res.status(200).json({
      message: "Lấy lịch sử mã giảm giá thành công",
      data: formattedTransaction,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi readDiscountCodeHistory", error);
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
