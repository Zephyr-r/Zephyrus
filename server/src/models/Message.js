import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    // 关联的订单（可选）
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    // 关联的商品（可选）
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    // 消息类型
    type: {
      type: String,
      enum: ["chat", "order", "system"],
      default: "chat",
    },
    // 是否已读
    read: {
      type: Boolean,
      default: false,
    },
    // 是否已删除（软删除）
    deleted: {
      type: Boolean,
      default: false,
    },
    // 可选关联的商品和订单
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

// 创建复合索引
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, read: 1 });

export const Message = mongoose.model("Message", messageSchema);
