import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  try {
    // 从cookie中获取token
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // 验证token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.active) {
      return res.status(403).json({ error: "Account is deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication error" });
  }
};

// 可选的管理员验证中间件
export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (!req.user.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Admin authentication error" });
  }
};
