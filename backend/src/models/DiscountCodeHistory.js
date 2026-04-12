import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const discountCodeHistorySchema = new mongoose.Schema(
  {
    historyId: {
      type: Number,
      unique: true,
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // người dùng
    code: { 
        type: String, 
        required: true 
    }, // mã giảm giá
    type: { 
        type: String, 
        enum: ["percent", "fixed"], 
        required: true 
    }, // loại (phần trăm / số tiền cố định)
    applyFor: { 
        type: String, 
        required: true 
    }, // áp dụng cho (vd: "Tất cả", "Danh mục Liên Quân", hoặc ID Acc)
    originalPrice: { 
        type: Number, 
        required: true 
    }, // giá gốc
    discountAmount: { 
        type: Number, 
        required: true 
    }, // số tiền được giảm
    finalPrice: { 
        type: Number, 
        required: true 
    }, // giá sau khi giảm (giá cuối)
  },
  { timestamps: true } // Thời gian t~ự động có (createdAt, updatedAt)
);

discountCodeHistorySchema.plugin(AutoIncrement, { inc_field: "historyId" });

const DiscountCodeHistory = mongoose.model(
  "DiscountCodeHistory",
  discountCodeHistorySchema,
);
export default DiscountCodeHistory;
