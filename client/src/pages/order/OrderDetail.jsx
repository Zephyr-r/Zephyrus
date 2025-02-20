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
          title: "Failed to fetch order",
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
      pending: { label: "In Progress", variant: "warning" },
      completed: { label: "Completed", variant: "success" },
      cancelled: { label: "Cancelled", variant: "destructive" },
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
        message = "Transaction completed!";
        navigate("/orders", {
          state: { orderCompleted: true, message: "Order completed" },
          replace: true,
        });
      } else if (action === "cancel") {
        message = "Order cancelled";
        navigate("/orders", {
          state: { orderCancelled: true, message: "Order cancelled" },
          replace: true,
        });
      }

      toast({
        title: "Order status updated",
        description: message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
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
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !order || !user || !order.buyer || !order.seller) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-500">
            {error || "Order does not exist or data is incomplete"}
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
              <CardTitle>Order Details</CardTitle>
              <CardDescription>Order ID: {order._id}</CardDescription>
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

          {/* 卖家信息 */}
          <div>
            <h3 className="font-medium mb-3">Seller Info</h3>
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
                Contact Seller
              </Button>
            </div>
          </div>

          <Separator />

          {/* 订单操作 */}
          {order.status === "pending" && (
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Order Cancellation?</DialogTitle>
                    <DialogDescription>
                      Once cancelled, the product will be relisted, and other
                      buyers can purchase it. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => handleOrderAction("cancel")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Confirm Cancel"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1" disabled={hasCurrentUserConfirmed}>
                    {hasCurrentUserConfirmed
                      ? "Confirmed"
                      : hasOtherPartyConfirmed
                      ? "Confirm Transaction"
                      : "Complete Transaction"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Transaction Completion?</DialogTitle>
                    <DialogDescription>
                      {hasOtherPartyConfirmed
                        ? "The other party has confirmed. Your confirmation will mark the order as completed."
                        : "Please confirm that the transaction has been completed. Both parties need to confirm before the order is finalized."}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      onClick={() => handleOrderAction("complete")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Confirm Complete"}
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
