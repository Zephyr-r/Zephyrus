import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/product/ImageUploader";
import { ProductForm } from "@/components/product/ProductForm";
import { useProductForm } from "@/hooks/useProductForm";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    loading,
    submitting,
    images,
    formData,
    handleInputChange,
    handleImageAdd,
    handleImageRemove,
    handleSubmit,
  } = useProductForm(id);

  const onSubmit = async (e) => {
    e.preventDefault(); // 防止默认表单提交行为
    const success = await handleSubmit(e);

    if (success) {
      // 获取可能的新 ID（如果是创建商品）
      const productId = id || success.id;
      navigate(`/product/${productId}`, { replace: true });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4">
        <div className="text-center py-8 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* 图片上传组件 */}
            <ImageUploader
              images={images}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
            />

            {/* 商品信息表单 */}
            <ProductForm
              formData={formData}
              onChange={handleInputChange}
              disabled={submitting}
            />

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1, { replace: true })} // 取消返回上一页
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
