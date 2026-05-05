import crypto from "crypto";
import DiscountCode from "../models/DiscountCode.js";
import DiscountCodeHistory from "../models/DiscountCodeHistory.js";

// Tự sinh mã giảm giá ngẫu nhiên 8 ký tự
const generateCode = () => {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
};

// Tạo mã giảm giá
export const createDiscountCode = async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      maxDiscount,
      maxUses,
      maxUsesPerUser,
      applyTo,
      minOrderValue,
      expirationDate,
      description,
      status,
    } = req.body;

    if (!type || value === undefined || value === "") {
      return res.status(400).json({ message: "Kiểu và giá trị là bắt buộc." });
    }

    // Nếu bạn để trống mã -> tự sinh
    const finalCode = code?.trim() || generateCode();

    // Check trùng mã
    const existed = await DiscountCode.findOne({
      code: finalCode.toUpperCase(),
    });
    if (existed) {
      return res.status(409).json({ message: "Mã giảm giá đã tồn tại." });
    }

    const discountCode = await DiscountCode.create({
      code: finalCode,
      type,
      value: Number(value),
      maxDiscount: type === "percent" ? Number(maxDiscount) || 0 : 0,
      maxUses: Number(maxUses) || 0,
      maxUsesPerUser: Number(maxUsesPerUser) || 1,
      applyTo: applyTo || "all",
      minOrderValue: Number(minOrderValue) || 0,
      expirationDate: expirationDate || undefined,
      description: description || "",
      status: status === "false" ? false : true,
    });

    return res.status(201).json({
      message: "Tạo mã giảm giá thành công",
      data: discountCode,
    });
  } catch (error) {
    console.error("Lỗi khi gọi createDiscountCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy tất cả mã giảm giá
export const readDiscountCode = async (req, res) => {
  try {
    const discountCodes = await DiscountCode.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Lấy danh sách mã giảm giá thành công",
      data: discountCodes,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readDiscountCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Lấy 1 mã giảm giá theo ID
export const readDiscountCodeById = async (req, res) => {
  try {
    const { id } = req.params;

    const discountCode = await DiscountCode.findById(id);
    if (!discountCode) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
    }

    return res.status(200).json({
      message: "Lấy mã giảm giá thành công",
      data: discountCode,
    });
  } catch (error) {
    console.error("Lỗi khi gọi readDiscountCodeById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Cập nhật mã giảm giá
export const updateDiscountCode = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      type,
      value,
      maxDiscount,
      maxUses,
      maxUsesPerUser,
      applyTo,
      minOrderValue,
      expirationDate,
      description,
      status,
    } = req.body;

    const discountCode = await DiscountCode.findById(id);
    if (!discountCode) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
    }

    // Check trùng mã nếu đổi mã
    if (code !== undefined && code.toUpperCase() !== discountCode.code) {
      const existed = await DiscountCode.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id },
      });
      if (existed) {
        return res.status(409).json({ message: "Mã giảm giá đã tồn tại." });
      }
      discountCode.code = code;
    }

    if (type !== undefined) discountCode.type = type;
    if (value !== undefined) discountCode.value = Number(value);
    if (maxDiscount !== undefined)
      discountCode.maxDiscount = Number(maxDiscount);
    if (maxUses !== undefined) discountCode.maxUses = Number(maxUses);
    if (maxUsesPerUser !== undefined)
      discountCode.maxUsesPerUser = Number(maxUsesPerUser);
    if (applyTo !== undefined) discountCode.applyTo = applyTo;
    if (minOrderValue !== undefined)
      discountCode.minOrderValue = Number(minOrderValue);
    if (expirationDate !== undefined)
      discountCode.expirationDate = expirationDate || undefined;
    if (description !== undefined) discountCode.description = description;
    if (status !== undefined)
      discountCode.status = status === "false" ? false : Boolean(status);

    await discountCode.save();

    return res.status(200).json({
      message: "Cập nhật mã giảm giá thành công",
      data: discountCode,
    });
  } catch (error) {
    console.error("Lỗi khi gọi updateDiscountCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Xoá mã giảm giá
export const deleteDiscountCode = async (req, res) => {
  try {
    const { id } = req.params;

    const discountCode = await DiscountCode.findById(id);
    if (!discountCode) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại." });
    }

    await DiscountCode.findByIdAndDelete(id);

    return res.status(200).json({
      message: `Đã xoá mã giảm giá ${discountCode.code}`,
    });
  } catch (error) {
    console.error("Lỗi khi gọi deleteDiscountCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// Áp dụng mã giảm giá (client gửi code + originalPrice + applyTo)
export const applyDiscountCode = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code, originalPrice, applyTo } = req.body;

    if (!code || !originalPrice) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập mã giảm giá." });
    }

    // 1. Tìm mã giảm giá
    const discountCode = await DiscountCode.findOne({
      code: code.trim().toUpperCase(),
    });
    if (!discountCode) {
      return res
        .status(404)
        .json({ message: "Mã giảm giá không tồn tại." });
    }

    // 2. Check trạng thái
    if (!discountCode.status) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã bị vô hiệu hoá." });
    }

    // 3. Check hết hạn
    if (
      discountCode.expirationDate &&
      new Date() > new Date(discountCode.expirationDate)
    ) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn." });
    }

    // 4. Check lượt sử dụng tối đa (toàn hệ thống)
    if (
      discountCode.maxUses > 0 &&
      discountCode.usedCount >= discountCode.maxUses
    ) {
      return res
        .status(400)
        .json({ message: "Mã giảm giá đã hết lượt sử dụng." });
    }

    // 5. Check lượt sử dụng của user này
    const userUsageCount = await DiscountCodeHistory.countDocuments({
      user: userId,
      code: discountCode.code,
    });
    if (
      discountCode.maxUsesPerUser > 0 &&
      userUsageCount >= discountCode.maxUsesPerUser
    ) {
      return res
        .status(400)
        .json({ message: "Bạn đã sử dụng hết lượt dùng mã này." });
    }

    // 6. Check giá trị đơn hàng tối thiểu
    if (
      discountCode.minOrderValue > 0 &&
      originalPrice < discountCode.minOrderValue
    ) {
      return res.status(400).json({
        message: `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN").format(discountCode.minOrderValue)}đ để sử dụng mã này.`,
      });
    }

    // 7. Check loại áp dụng (applyTo)
    if (discountCode.applyTo !== "all") {
      if (applyTo && discountCode.applyTo !== applyTo) {
        return res
          .status(400)
          .json({ message: "Mã giảm giá không áp dụng cho sản phẩm này." });
      }
    }

    // 8. Tính số tiền giảm
    let discountAmount = 0;
    if (discountCode.type === "percent") {
      discountAmount = Math.floor((originalPrice * discountCode.value) / 100);
      // Áp dụng giảm tối đa nếu có
      if (discountCode.maxDiscount > 0 && discountAmount > discountCode.maxDiscount) {
        discountAmount = discountCode.maxDiscount;
      }
    } else {
      // fixed
      discountAmount = discountCode.value;
    }

    // Không giảm quá giá gốc
    if (discountAmount > originalPrice) {
      discountAmount = originalPrice;
    }

    const finalPrice = originalPrice - discountAmount;

    return res.status(200).json({
      message: "Áp dụng mã giảm giá thành công",
      data: {
        code: discountCode.code,
        type: discountCode.type,
        value: discountCode.value,
        discountAmount,
        finalPrice,
        originalPrice,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi applyDiscountCode", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
