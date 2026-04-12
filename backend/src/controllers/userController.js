import User from "../models/User.js";
import UserHistory from "../models/UserHistory.js";
import Categories from "../models/Categories.js";
import Accounts from "../models/Accounts.js";   

export const authMe = (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      user: {
        id: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readListUser = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy danh sách users thành công",
      data: users,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readListUser", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const readUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    const transactions = await UserHistory.find({
      userId: user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Lấy thông tin user thành công",
      user,
      transactions,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readUserById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, balance, status } = req.body;
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // lưu lại số dư trước khi update
    const balanceBefore = user.balance;
    // update role nếu có
    if (role !== undefined) {
      user.role = role;
    }
    // update status nếu có
    if (status !== undefined) {
      user.status = status;
    }
    // nếu balance thay đổi thì lưu lịch sử
    if (balance !== undefined && Number(balance) !== user.balance) {
      const balanceAfter = Number(balance);
      const isIncrease = balanceAfter > balanceBefore;

      const actor = req.user?.username || "admin";
      const target = user.username;

      await UserHistory.create({
        userId: user._id,
        transaction: "adminTopUp",
        amount: Math.abs(balanceAfter - balanceBefore),
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: isIncrease
          ? `${actor} cộng tiền cho ${target}`
          : `${actor} trừ tiền của ${target}`,
      });

      user.balance = balanceAfter;
    }

    await user.save();
    return res.json({
      message: `Cập nhật người dùng ${user.username}`,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateUserById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "Xoá người dùng thành công",
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteUserById", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
