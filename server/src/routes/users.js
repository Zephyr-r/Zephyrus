import express from "express";
import { auth } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import bcrypt from "bcrypt";
import { uploadAvatar, deleteImage } from "../config/cloudinary.js";

const router = express.Router();

// 获取个人信息
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新个人信息
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["username"];

    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(req.user._id, filteredUpdates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取我的商品列表
router.get("/products", auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取我的订单列表
router.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("product")
      .populate("buyer", "username avatar")
      .populate("seller", "username avatar")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取我的销售统计
router.get("/stats", auth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({
      seller: req.user._id,
    });
    const soldProducts = await Product.countDocuments({
      seller: req.user._id,
      status: "sold",
    });
    const totalOrders = await Order.countDocuments({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    });

    res.json({
      totalProducts,
      soldProducts,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新头像
router.post("/avatar", auth, async (req, res) => {
  try {
    const { avatarBase64 } = req.body;
    const user = await User.findById(req.user._id);

    // 删除旧头像
    if (user.avatar && !user.avatar.includes("default")) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await deleteImage(publicId);
    }

    // 上传新头像
    const avatarUrl = await uploadAvatar(avatarBase64, "avatars");
    user.avatar = avatarUrl;
    await user.save();

    res.json({
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 修改密码
router.put("/password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 获取特定用户信息
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "用户不存在" });
    }
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取特定用户的商品列表
router.get("/:userId/products", async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.params.userId,
      status: "available",
    }).sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
