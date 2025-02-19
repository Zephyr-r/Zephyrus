import express from "express";
import multer from "multer";
import path from "path";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// 改进的存储配置
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制5MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// 测试路由
router.get("/test", (req, res) => {
  res.json({ message: "Upload route working" });
});

// 单图上传
router.post("/single", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // 返回更详细的信息
  res.json({
    message: "File uploaded successfully",
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    },
  });
});

// 多图上传
router.post("/multiple", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  const files = req.files.map((file) => ({
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${file.filename}`,
  }));

  res.json({
    message: "Files uploaded successfully",
    files: files,
  });
});

export default router;
