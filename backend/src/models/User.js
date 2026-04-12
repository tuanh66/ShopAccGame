import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    maxBalance: {
      type: Number,
      default: 0,
    },
    lastIp: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(AutoIncrement, { inc_field: "userId" });

const User = mongoose.model("User", userSchema);
export default User;
