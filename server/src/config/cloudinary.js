import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// 基础配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 商品图片上传
export const uploadProductImage = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "products",
      resource_type: "auto",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto:good" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Product image upload failed: ${error.message}`);
  }
};

// 头像上传
export const uploadAvatar = async (base64String) => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: "avatars",
      resource_type: "auto",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto:good" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Avatar upload failed: ${error.message}`);
  }
};

// 删除图片
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Image deletion failed: ${error.message}`);
  }
};

export default cloudinary;
