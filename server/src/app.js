import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import { errorHandler } from "./middleware/error.js";
import rateLimit from "express-rate-limit";
import { User } from "./models/User.js";

dotenv.config();

const app = express();

// CORS 配置
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

// 中间件
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// 路由
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// 添加速率限制
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 5000, // 每个 IP 1小时内最多 5000 次请求
  message: { error: "请求过于频繁，请稍后再试" },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 跳过某些不需要限制的路由
    return (
      req.path.startsWith("/api/auth/me") ||
      req.path.startsWith("/api/products") ||
      req.method === "OPTIONS"
    );
  },
});

// 为登录注册设置限制
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个 IP 15分钟内最多 100 次请求
  message: { error: "登录尝试过于频繁，请稍后再试" },
  standardHeaders: true,
  legacyHeaders: false,
});

// 应用速率限制
app.post("/api/auth/login", authLimiter); // 只限制 POST 请求
app.post("/api/auth/register", authLimiter);
app.use(limiter);

// 错误处理中间件
app.use(errorHandler);

// 连接数据库并启动服务器
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // 确保索引存在
  await User.createIndexes();
  console.log("Database indexes ensured");

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} catch (err) {
  console.error("MongoDB connection error:", err);
}

export default app;
