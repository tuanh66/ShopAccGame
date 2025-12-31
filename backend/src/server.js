import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRoute.js";
import accountRoute from "./routers/accountRoute.js";
import historyRoute from "./routers/historyRoute.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// cors origin
app.use(
  cors({
    origin: "http://localhost:5173", // FE
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// xử lý preflight
app.options("*", cors());

// middlewares
app.use(express.json());
app.use(cookieParser());

// public routes
app.use("/api/auth", authRoute);
app.use("/api/history", historyRoute);
app.use("/api/account", accountRoute);

// private routes
app.use(protectedRoute);
app.use("/api/users", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
  });
});
