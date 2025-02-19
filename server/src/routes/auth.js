import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Cookie settings helper
const getCookieSettings = () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  return {
    httpOnly: true,
    secure: !isDevelopment,
    sameSite: isDevelopment ? "lax" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
};

// 注册路由
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // 验证输入
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 验证用户名长度
    if (username.length < 3 || username.length > 20) {
      return res
        .status(400)
        .json({ error: "Username must be between 3 and 20 characters" });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 创建新用户
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username
      )}&background=e5e7eb&color=4b5563&size=128`,
    });

    await user.save();

    // 返回成功消息
    res.status(201).json({
      success: true,
      message: "Registration successful. Please login to continue.",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 登录路由
router.post("/login", async (req, res) => {
  try {
    console.log("Login attempt:", { username: req.body.username });
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({ error: "请填写所有必填字段" });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    // 生成 JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 设置 cookie
    const cookieSettings = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      path: "/",
    };

    console.log("Setting cookie with token");
    res.cookie("token", token, cookieSettings);

    // 返回用户信息
    const response = {
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        avatar: user.avatar,
      },
    };
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ error: error.message });
  }
});

// 登出路由
router.post("/logout", auth, (req, res) => {
  // 清除 cookie
  console.log("Clearing auth cookie");
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // 立即过期
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

// 获取当前用户信息
router.get("/me", auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      avatar: req.user.avatar,
      lastUsernameUpdate: req.user.lastUsernameUpdate,
      bio: req.user.bio,
    },
  });
});

// 刷新token
router.post("/refresh-token", auth, async (req, res) => {
  try {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, getCookieSettings());

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 修改密码
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // 验证当前密码
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }

    // 更新密码
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
