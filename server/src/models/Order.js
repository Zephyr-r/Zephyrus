import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  confirmations: {
    buyer: { type: Boolean, default: false },
    seller: { type: Boolean, default: false },
  },
  price: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    enum: ["face_to_face", "credit_card", "debit_card", "paypal"],
    required: true,
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 更新时自动更新updatedAt字段
orderSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Order = mongoose.model("Order", orderSchema);
