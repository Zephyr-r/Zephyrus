import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getProductById, updateProduct, createProduct } from "@/api/products";

export const useProductForm = (productId = null) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    condition: "new",
  });

  // 如果有 productId，则获取商品信息
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProductById(productId);
        const product = response.data;

        setFormData({
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
          condition: product.condition,
        });

        setImages(
          product.images.map((url) => ({
            url,
            file: null,
            isExisting: true,
          }))
        );
      } catch (error) {
        toast({
          variant: "destructive",
          title: "获取商品信息失败",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageAdd = (newImages) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "请填写商品标题",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        variant: "destructive",
        title: "请选择商品分类",
      });
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        variant: "destructive",
        title: "请输入有效的价格",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "请填写商品描述",
      });
      return false;
    }

    if (images.length === 0) {
      toast({
        variant: "destructive",
        title: "请至少上传一张商品图片",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return false;

    setSubmitting(true);

    try {
      // 将新上传的图片转换为 base64
      const newImagesBase64 = await Promise.all(
        images
          .filter((img) => !img.isExisting)
          .map(
            (image) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = () => reject(new Error("图片处理失败"));
                reader.readAsDataURL(image.file);
              })
          )
      );

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (productId) {
        // 更新商品
        const existingImageUrls = images
          .filter((img) => img.isExisting)
          .map((img) => img.url);

        await updateProduct(productId, {
          ...productData,
          images: existingImageUrls,
          newImages: newImagesBase64,
        });

        toast({
          title: "更新成功",
          description: "商品信息已更新",
        });
      } else {
        // 创建商品
        await createProduct({
          ...productData,
          imageBase64Array: newImagesBase64,
        });

        toast({
          title: "发布成功",
          description: "商品已发布到首页",
        });
      }

      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: productId ? "更新失败" : "发布失败",
        description: error.message,
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    images,
    formData,
    handleInputChange,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
  };
};
