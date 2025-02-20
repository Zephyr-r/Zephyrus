import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageUploader } from "@/components/product/ImageUploader";
import { ProductForm } from "@/components/product/ProductForm";
import { useProductForm } from "@/hooks/useProductForm";

const Sell = () => {
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
  } = useProductForm();

  const onSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4">
        {/* 加载状态 */}
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sell Product</CardTitle>
          <CardDescription>
            Fill in the product details to reach more buyers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            {/* 图片上传组件 */}
            <ImageUploader
              images={images}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
            />
            <Separator />
            {/* 商品信息表单 */}
            <ProductForm
              formData={formData}
              onChange={handleInputChange}
              disabled={submitting}
            />
            <div className="flex gap-4">
              {/* 取消按钮 */}
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              {/* 提交按钮 */}
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "Submitting..." : "Publish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sell;
