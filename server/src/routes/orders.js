import express from "express";
import { auth } from "../middleware/auth.js";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

const router = express.Router();

// Create order
router.post("/", auth, async (req, res) => {
  try {
    const { productId, paymentMethod } = req.body;

    // 1. 查找并验证商品
    const product = await Product.findById(productId).populate(
      "seller",
      "username avatar"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. 验证商品状态
    if (product.status !== "available") {
      return res
        .status(400)
        .json({ error: "Product is already purchased or unavailable" });
    }

    // 3. 验证卖家身份
    if (product.seller._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "Cannot purchase your own product" });
    }

    // 4. 验证支付方式
    if (!paymentMethod) {
      return res.status(400).json({ error: "Please select a payment method" });
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
        address: "Face-to-face transaction",
        city: "Face-to-face transaction",
        state: "Face-to-face transaction",
        zipCode: "00000",
        phone: "Face-to-face transaction",
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
      return res.status(400).json({ error: "Order data validation failed" });
    }
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get my orders (buyer/seller)
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

// Get order details
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("buyer", "username avatar")
      .populate("seller", "username avatar");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 检查是否是订单的买家或卖家
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "No permission to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to get order details" });
  }
});

// Update order status
router.put("/:id/status", auth, async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  const userId = req.user.id;

  try {
    // 验证订单存在性
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 验证用户权限
    if (
      order.buyer.toString() !== userId &&
      order.seller.toString() !== userId
    ) {
      return res.status(403).json({ error: "No permission to operate" });
    }

    // 检查订单状态
    if (order.status === "completed" || order.status === "cancelled") {
      return res
        .status(400)
        .json({ error: "Order is already completed or cancelled" });
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
        return res.status(400).json({ error: "Invalid operation type" });
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
    res
      .status(500)
      .json({ error: error.message || "Failed to update order status" });
  }
});

export default router;
