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
    navigate("/");
    return null;
  }

  const item = product || order?.product;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      // 1. 验证商品信息
      if (!item?._id) {
        throw new Error("商品信息无效");
      }

      // 2. 验证商品价格
      if (!item.price || item.price <= 0) {
        throw new Error("商品价格无效");
      }

      // 3. 验证卖家信息
      if (!item.seller || !item.seller._id) {
        throw new Error("卖家信息无效");
      }

      // 4. 准备订单数据
      const orderData = {
        productId: item._id,
        paymentMethod: "face_to_face",
      };

      // 5. 创建订单
      const response = await createOrder(orderData);

      // 6. 处理成功响应
      toast({
        title: "订单创建成功",
        description: "请尽快与卖家联系完成交易",
      });

      // 7. 跳转到订单列表
      navigate("/orders", {
        state: {
          orderCreated: true,
          message: "订单已创建，请尽快与卖家联系完成交易",
        },
        replace: true,
      });
    } catch (error) {
      // 8. 错误处理
      toast({
        variant: "destructive",
        title: "创建订单失败",
        description: error.message || "创建订单时发生错误",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>确认订单</CardTitle>
          <CardDescription>确认订单信息并联系卖家完成交易</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 商品信息 */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="w-20 h-20 overflow-hidden rounded-md">
              <img
                src={item.image}
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
              确认订单后，请及时与卖家联系，协商具体交易细节和支付方式。
              为了保障交易安全，建议：
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>选择安全的见面地点完成交易</li>
                <li>仔细检查商品后再付款</li>
                <li>保留交易凭证</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Separator />

          {/* 订单详情 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>商品金额</span>
              <span>RM {item.price}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>实付金额</span>
              <span>RM {item.price}</span>
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              返回
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "确认中..." : "确认订单"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
