import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoute from "./routers/authRoute.js";
import userRoute from "./routers/userRoute.js";
import categoriesRoute from "./routers/categoriesRoute.js";
import accountsRoute from "./routers/accountsRoute.js";
import historyRoute from "./routers/historyRoute.js";
import paymentRoute from "./routers/paymentRoute.js";
import cookieParser from "cookie-parser";
// import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// public routes
app.set("trust proxy", true);
app.use("/api/auth", authRoute);
app.use("/api/history", historyRoute);
app.use("/api/categories", categoriesRoute);
app.use("/api/accounts", accountsRoute);
app.use("/api/payment", paymentRoute);

// private routes
// app.use(protectedRoute);
app.use("/api/users", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
  });
});
