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
        <div className="text-center py-8">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">发布商品</CardTitle>
          <CardDescription>填写商品信息，让更多人看到你的商品</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            <ImageUploader
              images={images}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
            />
            <Separator />
            <ProductForm
              formData={formData}
              onChange={handleInputChange}
              disabled={submitting}
            />
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? "发布中..." : "发布商品"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sell;
