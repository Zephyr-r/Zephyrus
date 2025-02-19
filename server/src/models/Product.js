import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "reserved", "sold"],
    default: "available",
  },
  category: {
    type: String,
    required: true,
    enum: ["electronics", "clothing", "books", "furniture", "sports", "others"],
  },
  condition: {
    type: String,
    required: true,
    enum: ["new", "like-new", "good", "fair", "poor"],
  },
  views: {
    type: Number,
    default: 0,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// 添加全文搜索索引
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
});

export const Product = mongoose.model("Product", productSchema);
