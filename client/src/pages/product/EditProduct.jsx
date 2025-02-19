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
    const success = await handleSubmit(e);
    if (success) {
      navigate(`/product/${id}`);
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
          <CardTitle className="text-2xl font-bold">编辑商品</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-8">
            <ImageUploader
              images={images}
              onImageAdd={handleImageAdd}
              onImageRemove={handleImageRemove}
            />
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
                {submitting ? "保存中..." : "保存更改"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
