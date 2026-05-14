import User from "../models/User.js";
import Accounts from "../models/Accounts.js";
import RandomAccounts from "../models/RandomAccounts.js";
import Categories from "../models/Categories.js";
import UserHistory from "../models/UserHistory.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";
import BankAccountsHistory from "../models/BankAccountsHistory.js";
import CardTopUpHistory from "../models/CardTopUpHistory.js";
import AccountsHistory from "../models/AccountsHistory.js";
import RandomAccountsHistory from "../models/RandomAccountsHistory.js";
import DiscountCode from "../models/DiscountCode.js";

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 3);
    tenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalAccounts,
      unsoldAccounts,
      soldAccounts,
      totalUsers,
      totalRandomAccounts,
      newUsersToday,
      totalDeposit,
      totalPurchase,
      totalRefund,
      activeDiscountCodes,
      recentTransactions,
    ] = await Promise.all([
      Accounts.countDocuments(),
      Accounts.countDocuments({ status: false }),
      Accounts.countDocuments({ status: true }),
      User.countDocuments(),
      RandomAccounts.countDocuments({ status: false }),
      User.countDocuments({ createdAt: { $gte: today } }),
      // Gộp chung nạp Bank và Thẻ vào 1 biến totalDeposit (Chỉ tính trong tháng này)
      (async () => {
        const [bank, card] = await Promise.all([
          BankAccountsHistory.aggregate([
            {
              $match: { status: "success", createdAt: { $gte: startOfMonth } },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]),
          CardTopUpHistory.aggregate([
            {
              $match: { status: "success", createdAt: { $gte: startOfMonth } },
            },
            { $group: { _id: null, total: { $sum: "$amount_received" } } },
          ]),
        ]);
        return (bank[0]?.total || 0) + (card[0]?.total || 0);
      })(),
      // Lấy tổng doanh thu từ lịch sử mua hàng (Chỉ tính trong tháng này)
      (async () => {
        const [accounts, random] = await Promise.all([
          AccountsHistory.aggregate([
            { $match: { status: true, createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ]),
          RandomAccountsHistory.aggregate([
            { $match: { status: true, createdAt: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$price" } } },
          ]),
        ]);
        return (accounts[0]?.total || 0) + (random[0]?.total || 0);
      })(),
      (async () => {
        const result = await UserHistory.aggregate([
          {
            $match: {
              transaction: "adminTopUp",
              createdAt: { $gte: startOfMonth },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);
        return result[0]?.total || 0;
      })(),
      DiscountCode.find({
        status: true,
        $or: [
          { expirationDate: { $exists: false } },
          { expirationDate: null },
          { expirationDate: { $gte: new Date() } },
        ],
      })
        .select("-_id discountCodeId code value type expirationDate")
        .sort({ createdAt: -1 }),
      UserHistory.find({ createdAt: { $gte: tenDaysAgo } })
        .populate("userId", "username")
        .select(
          "-_id userHistoryId transaction amount balance_before balance_after description createdAt",
        )
        .sort({ createdAt: -1 }),
    ]);

    // Thống kê người dùng theo role
    const userRoles = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const userStatistics = userRoles.reduce((acc, curr) => {
      const role = curr._id === "member" ? "customer" : curr._id;
      acc[role] = curr.count;
      return acc;
    }, {});

    // Thống kê Tuần hiện tại (Thứ 2 -> Chủ nhật)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (CN) -> 6 (T7)
    const diff = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Tính lùi về Thứ 2
    const startOfWeek = new Date(now.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    // Thống kê đăng ký mới
    const registrationStatistics = {
      today: newUsersToday,
      thisWeek: await User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      thisMonth: await User.countDocuments({
        createdAt: { $gte: startOfMonth },
      }),
    };

    // Thống kê nạp tiền & mua hàng (7 ngày gần đây)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [bankStats, cardStats, accStats, randomStats] = await Promise.all([
      BankAccountsHistory.aggregate([
        { $match: { status: "success", createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
            total: { $sum: "$amount" },
          },
        },
      ]),
      CardTopUpHistory.aggregate([
        { $match: { status: "success", createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
            total: { $sum: "$amount_received" },
          },
        },
      ]),
      AccountsHistory.aggregate([
        { $match: { status: true, createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
            total: { $sum: "$price" },
          },
        },
      ]),
      RandomAccountsHistory.aggregate([
        { $match: { status: true, createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
            total: { $sum: "$price" },
          },
        },
      ]),
    ]);

    // Gộp dữ liệu thành 7 ngày
    const topupAndPurchaseStatistics = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const dayStr = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;

      const bank = bankStats.find((s) => s._id === dayStr)?.total || 0;
      const card = cardStats.find((s) => s._id === dayStr)?.total || 0;
      const acc = accStats.find((s) => s._id === dayStr)?.total || 0;
      const random = randomStats.find((s) => s._id === dayStr)?.total || 0;

      topupAndPurchaseStatistics.push({
        date: dayStr,
        topup: bank + card,
        purchase: acc + random,
      });
    }

    const stats = {
      counts: {
        totalAccounts,
        unsoldAccounts,
        soldAccounts,
        totalUsers,
        totalRandomAccounts,
        newUsersToday,
      },
      finance: {
        totalDeposit,
        totalPurchase,
        totalRefund,
      },
      activeDiscountCodes,
      userStatistics,
      registrationStatistics,
      recentTransactions: recentTransactions.map((item) => {
        const obj = item.toObject();
        return {
          ...obj,
          userName: obj.userId?.username,
          userId: undefined,
        };
      }),
      topupAndPurchaseStatistics,
    };

    return res.status(200).json({
      message: "Lấy thống kê dashboard thành công",
      data: stats,
    });
  } catch (error) {
    console.error("Lỗi getDashboardStats:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
