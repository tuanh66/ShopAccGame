import mongoose from "mongoose";

const accountsSchema = new mongoose.Schema(
  {
    categories_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    price_sale: {
      type: Number,
      default: null,
      validate: {
        validator: function (value) {
          return value === null || value < this.price;
        },
        message: "Giá giảm phải nhỏ hơn giá gốc",
      },
    },
    avatar: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      default: [],
    },
    attributes: {
      type: Object,
      default: {},
    },
    status: {
      type: Boolean,
      default: false,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

accountsSchema.index({ categories_id: 1, username: 1 }, { unique: true });

const Accounts = mongoose.model("Accounts", accountsSchema);
export default Accounts;
