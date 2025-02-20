import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IoInformationCircle } from "react-icons/io5";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/api/orders";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { product, order } = location.state || {};
  const [isConfirming, setIsConfirming] = useState(false);

  // 如果没有商品或订单信息，重定向到首页
  if (!product && !order) {
    navigate("/", { replace: true });
    return null;
  }

  const item = product || order?.product;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // 1. 验证商品信息
      if (!item?._id) throw new Error("Invalid product information");

      // 2. 验证商品价格
      if (!item.price || item.price <= 0)
        throw new Error("Invalid product price");

      // 3. 验证卖家信息
      if (!item.seller || !item.seller._id)
        throw new Error("Invalid seller information");

      // 4. 准备订单数据
      const orderData = {
        productId: item._id,
        paymentMethod: "face_to_face",
      };

      // 5. 创建订单
      await createOrder(orderData);

      // 6. 处理成功响应
      toast({
        title: "Order Created Successfully",
        description: "Please contact the seller to complete the transaction.",
      });

      // 7. 跳转到订单列表
      navigate("/orders", {
        state: {
          orderCreated: true,
          message: "Order created successfully. Please contact the seller.",
        },
        replace: true,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      // 8. 错误处理
      toast({
        variant: "destructive",
        title: "Order Creation Failed",
        description:
          error.message || "An error occurred while creating the order.",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Confirm Order</CardTitle>
          <CardDescription>
            Review order details and contact the seller to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 商品信息 */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="w-20 h-20 overflow-hidden rounded-md">
              <img
                src={item.images?.[0] || "https://placehold.co/80"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{item.name}</h3>
              <div className="text-2xl font-bold">RM {item.price}</div>
            </div>
          </div>

          <Separator />

          {/* 交易提示 */}
          <Alert>
            <IoInformationCircle className="h-4 w-4" />
            <AlertDescription>
              After confirming the order, please contact the seller to arrange
              transaction details. For a safe transaction, consider:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Meeting at a safe location</li>
                <li>Inspecting the product before payment</li>
                <li>Keeping a record of the transaction</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Separator />

          {/* 订单详情 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Product Price</span>
              <span>RM {item.price}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total Amount</span>
              <span>RM {item.price}</span>
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1, { replace: true })}
            >
              Back
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Confirming..." : "Confirm Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
