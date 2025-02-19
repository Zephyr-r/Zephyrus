import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";

import { useAuth } from "@/hooks/useAuth";

import { getOrderById, updateOrderStatus } from "@/api/orders";

const OrderDetail = () => {
  const { orderId } = useParams();

  const navigate = useNavigate();

  const { toast } = useToast();

  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // 获取订单详情

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const data = await getOrderById(orderId);

        setOrder(data);
      } catch (err) {
        setError(err.message);

        toast({
          variant: "destructive",

          title: "获取订单失败",

          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  // 获取状态对应的徽章样式

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "进行中", variant: "warning" },

      completed: { label: "已完成", variant: "success" },

      cancelled: { label: "已取消", variant: "destructive" },
    };

    const { label, variant } = statusMap[status] || statusMap.pending;

    return <Badge variant={variant}>{label}</Badge>;
  };

  // 处理订单操作

  const handleOrderAction = async (action) => {
    setIsProcessing(true);

    try {
      const response = await updateOrderStatus(orderId, { action });

      setOrder(response);

      let message = "";

      if (action === "complete") {
        message = "交易已完成！";
        // 确认完成后直接跳转到订单列表
        navigate("/orders", {
          state: {
            orderCompleted: true,
            message: "订单已完成",
          },
          replace: true,
        });
      } else if (action === "cancel") {
        message = "订单已取消";
        navigate("/orders", {
          state: {
            orderCancelled: true,
            message: "订单已取消",
          },
          replace: true,
        });
      }

      toast({
        title: "订单状态已更新",
        description: message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: error.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  if (error || !order || !user || !order.buyer || !order.seller) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">
            {error || "订单不存在或数据不完整"}
          </div>
        </div>
      </div>
    );
  }

  // 在确保所有数据都存在后再进行身份判断
  const isBuyer =
    user._id &&
    order.buyer._id &&
    user._id.toString() === order.buyer._id.toString();

  // 获取当前用户是否已确认
  const hasCurrentUserConfirmed = isBuyer
    ? order.confirmations?.buyer
    : order.confirmations?.seller;

  // 获取对方是否已确认
  const hasOtherPartyConfirmed = isBuyer
    ? order.confirmations?.seller
    : order.confirmations?.buyer;

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>订单详情</CardTitle>
              <CardDescription>订单号：{order._id}</CardDescription>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 商品信息 */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="w-20 h-20 overflow-hidden rounded-md">
              <img
                src={order.product.images[0]}
                alt={order.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">{order.product.name}</h3>
              <div className="text-2xl font-bold">RM {order.product.price}</div>
            </div>
          </div>

          <Separator />

          {/* 对方信息 */}
          <div>
            <h3 className="font-medium mb-3">卖家信息</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={order.seller.avatar} />
                  <AvatarFallback>{order.seller.username[0]}</AvatarFallback>
                </Avatar>
                <span>{order.seller.username}</span>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  navigate("/inbox", {
                    state: {
                      seller: {
                        _id: order.seller._id,
                        username: order.seller.username,
                        avatar: order.seller.avatar,
                      },
                    },
                  })
                }
              >
                联系卖家
              </Button>
            </div>
          </div>

          <Separator />

          {/* 订单信息 */}
          <div className="space-y-3">
            <h3 className="font-medium">订单信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">创建时间</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付方式</span>
                <span>
                  {order.paymentMethod === "face_to_face"
                    ? "当面交易"
                    : order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">商品金额</span>
                <span>RM {order.price}</span>
              </div>
              {order.status === "pending" && (
                <>
                  <div className="flex justify-between text-muted-foreground">
                    <span>买家确认状态</span>
                    <span>
                      {order.confirmations?.buyer ? "已确认" : "未确认"}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>卖家确认状态</span>
                    <span>
                      {order.confirmations?.seller ? "已确认" : "未确认"}
                    </span>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>实付金额</span>
                <span>RM {order.price}</span>
              </div>
            </div>
          </div>

          {/* 订单操作 */}
          {order.status === "pending" && (
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    取消订单
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认取消订单？</DialogTitle>
                    <DialogDescription>
                      取消订单后，商品将重新上架，其他买家可以购买。此操作不可撤销。
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => handleOrderAction("cancel")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "处理中..." : "确认取消"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1" disabled={hasCurrentUserConfirmed}>
                    {hasCurrentUserConfirmed
                      ? "已确认完成"
                      : hasOtherPartyConfirmed
                      ? "确认完成交易"
                      : "完成交易"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>确认完成交易？</DialogTitle>
                    <DialogDescription>
                      {hasOtherPartyConfirmed
                        ? "对方已确认完成交易，您确认后订单将标记为已完成。"
                        : "请确认已完成当面交易，并检查商品无误。需要双方都确认后订单才会完成。"}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      onClick={() => handleOrderAction("complete")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "处理中..." : "确认完成"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
