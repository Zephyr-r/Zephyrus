import express from "express";
import { auth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { uploadProductImage, deleteImage } from "../config/cloudinary.js";
import { successResponse, errorResponse } from "../utils/response.js";

const router = express.Router();

// 获取商品列表（支持分页和筛选）
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      condition,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // 应用筛选条件
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 只显示可用的商品
    query.status = "available";

    // 构建排序对象
    const sort = {};
    sort[sortBy] = order === "desc" ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    // 执行查询
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("seller", "username avatar");

    // 获取总数
    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 搜索商品
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Search query:", q);

    if (!q) {
      console.log("No search query provided, returning empty array");
      return res.json(successResponse([]));
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
      status: "available", // 只搜索可用商品
    })
      .populate("seller", "username avatar")
      .limit(20);

    console.log("Found products:", products.length);

    if (!products) {
      console.log("Products is null or undefined");
      return res.json(successResponse([]));
    }

    res.json(successResponse(products));
  } catch (error) {
    console.error("Search error:", error);
    res.status(400).json(errorResponse(error.message));
  }
});

// 获取商品详情
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "username avatar")
      .populate("favorites", "username avatar");

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    res.json(successResponse(product));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

// 创建商品
router.post("/", auth, async (req, res) => {
  try {
    const { name, price, description, category, condition, imageBase64Array } =
      req.body;

    // 验证必填字段
    if (!name || !price || !description || !category || !condition) {
      return res.status(400).json(errorResponse("All fields are required"));
    }

    // 上传图片
    const imageUrls = [];
    if (!imageBase64Array || imageBase64Array.length === 0) {
      return res
        .status(400)
        .json(errorResponse("At least one image is required"));
    }

    for (const base64String of imageBase64Array) {
      const imageUrl = await uploadProductImage(base64String);
      imageUrls.push(imageUrl);
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      condition,
      images: imageUrls,
      seller: req.user._id,
    });

    await product.save();
    res.status(201).json(successResponse(product));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
});

// 更新商品
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(errorResponse("Not authorized"));
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      product[key] = updates[key];
    });

    await product.save();
    res.json(successResponse(product));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
});

// 删除商品
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json(errorResponse("Not authorized"));
    }

    // 删除商品图片
    for (const imageUrl of product.images) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await deleteImage(publicId);
    }

    await product.deleteOne();
    res.json(successResponse(null, "Product deleted successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
});

export default router;
