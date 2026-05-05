import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const discountCodeSchema = new mongoose.Schema(
  {
    discountCodeId: {
      type: Number,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    }, // mã giảm giá (ví dụ: SUMMER2024, chuyển hết thành chữ in hoa)
    type: {
      type: String,
      enum: ["percent", "fixed"],
      required: true,
    }, // kiểu (phần trăm / số tiền cố định)
    value: {
      type: Number,
      required: true,
      min: 0,
    }, // giá trị (Ví dụ: type = percent, value = 10 -> giảm 10%. type = fixed, value = 50000 -> giảm 50k)
    maxDiscount: {
      type: Number,
      default: 0,
    }, // giảm tối đa (Áp dụng khi dùng mã phần trăm, 0 = không giới hạn)
    minOrderValue: {
      type: Number,
      default: 0,
    }, // số tiền mua tối thiểu để được giảm (0 = đơn nào cũng giảm)
    maxUses: {
      type: Number,
      default: 0,
    }, // lượt sử dụng tối đa của mã này trên toàn hệ thống (0 = vô hạn đâm chém)
    maxUsesPerUser: {
      type: Number,
      default: 1,
    }, // giới hạn lượt dùng cho mỗi cá nhân người dùng (mỗi ông đc xài bao nhiêu lần)
    applyTo: {
      type: String,
      enum: ["all", "account", "random"],
      default: "all",
    }, // áp dụng cho (all = tất cả, account = tài khoản, random = random tài khoản)
    expirationDate: {
      type: Date,
    }, // ngày hết hạn (áp dụng nếu có)
    usedCount: {
      type: Number,
      default: 0,
    }, // số lần đã sử dụng (dùng để tính lượt còn lại = maxUses - usedCount)
    description: {
      type: String,
      default: "",
    }, // mô tả mã giảm giá
    status: {
      type: Boolean,
      default: true,
    }, // trạng thái hoạt động (bật/tắt mã)
  },
  { timestamps: true },
);

discountCodeSchema.plugin(AutoIncrement, { inc_field: "discountCodeId" });

const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
export default DiscountCode;
