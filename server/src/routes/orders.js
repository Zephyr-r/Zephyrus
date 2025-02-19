import express from "express";
import { auth } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// 创建订单
router.post("/", auth, async (req, res) => {
  try {
    const { productId, paymentMethod } = req.body;

    // 1. 查找并验证商品
    const product = await Product.findById(productId).populate(
      "seller",
      "username avatar"
    );
    if (!product) {
      return res.status(404).json({ error: "商品不存在" });
    }

    // 2. 验证商品状态
    if (product.status !== "available") {
      return res.status(400).json({ error: "商品已被购买或已下架" });
    }

    // 3. 验证卖家身份
    if (product.seller._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "不能购买自己的商品" });
    }

    // 4. 验证支付方式
    if (!paymentMethod) {
      return res.status(400).json({ error: "请选择支付方式" });
    }

    // 5. 创建订单
    const order = new Order({
      product: product._id,
      buyer: req.user._id,
      seller: product.seller._id,
      price: product.price,
      paymentMethod,
      status: "pending",
      shippingAddress: {
        address: "当面交易",
        city: "当面交易",
        state: "当面交易",
        zipCode: "00000",
        phone: "当面交易",
      },
    });

    // 6. 更新商品状态
    product.status = "reserved";

    // 7. 保存更改
    await product.save();
    await order.save();

    // 8. 返回完整的订单信息
    await order.populate([
      { path: "product" },
      { path: "buyer", select: "username avatar" },
      { path: "seller", select: "username avatar" },
    ]);

    res.status(201).json(order);
  } catch (error) {
    // 9. 错误处理
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "订单数据验证失败" });
    }
    res.status(500).json({ error: "创建订单失败" });
  }
});

// 获取我的订单列表（买家/卖家）
router.get("/", auth, async (req, res) => {
  try {
    const {
      role = "buyer", // buyer 或 seller
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};
    query[role] = req.user._id;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("product")
      .populate("buyer", "username avatar")
      .populate("seller", "username avatar");

    const total = await Order.countDocuments(query);

    // 直接返回订单数组
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取订单详情
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("buyer", "username avatar")
      .populate("seller", "username avatar");

    if (!order) {
      return res.status(404).json({ error: "订单不存在" });
    }

    // 检查是否是订单的买家或卖家
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "没有权限查看此订单" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "获取订单详情失败" });
  }
});

// 更新订单状态
router.put("/:id/status", auth, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const userId = req.user.id;

  try {
    // 验证订单存在性
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "订单不存在" });
    }

    // 验证用户权限
    if (
      order.buyer.toString() !== userId &&
      order.seller.toString() !== userId
    ) {
      return res.status(403).json({ error: "没有操作权限" });
    }

    // 检查订单状态
    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({ error: "订单已完成或已取消" });
    }

    // 根据不同操作更新订单状态
    switch (action) {
      case "complete":
        // 判断是买家还是卖家的确认
        const isBuyer = order.buyer.toString() === userId;
        const isSeller = order.seller.toString() === userId;

        if (isBuyer) {
          order.confirmations.buyer = true;
        } else if (isSeller) {
          order.confirmations.seller = true;
        }

        // 检查是否双方都已确认
        if (order.confirmations.buyer && order.confirmations.seller) {
          order.status = "completed";
          // 更新商品状态为已售出
          const product = await Product.findById(order.product);
          if (product) {
            product.status = "sold";
            await product.save();
          }
        }
        break;

      case "cancel":
        order.status = "cancelled";
        // 更新商品状态为可用
        const cancelledProduct = await Product.findById(order.product);
        if (cancelledProduct) {
          cancelledProduct.status = "available";
          await cancelledProduct.save();
        }
        break;

      default:
        return res.status(400).json({ error: "无效的操作类型" });
    }

    await order.save();

    // 返回完整的订单信息
    await order.populate([
      { path: "product" },
      { path: "buyer", select: "username avatar" },
      { path: "seller", select: "username avatar" },
    ]);

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message || "更新订单状态失败" });
  }
});

export default router;
