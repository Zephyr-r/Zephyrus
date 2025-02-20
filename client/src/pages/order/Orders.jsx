import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getOrders } from "@/api/orders";
import { useAuth } from "@/hooks/useAuth";

const Orders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Failed to fetch orders",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 处理从订单详情页返回的状态
  useEffect(() => {
    if (location.state?.orderCancelled) {
      toast({
        title: "Order status updated",
        description: location.state.message,
      });
      navigate(".", { replace: true, state: {} });
      fetchOrders();
    } else if (location.state?.orderCreated) {
      toast({
        title: "Order created successfully",
        description: location.state.message,
      });
      fetchOrders();
      navigate(".", { replace: true, state: {} });
    } else if (location.state?.orderCompleted) {
      toast({
        title: "Order status updated",
        description: location.state.message,
      });
      fetchOrders();
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Pending", className: "bg-yellow-500" },
      completed: { label: "Completed", className: "bg-green-500" },
      cancelled: { label: "Cancelled", className: "bg-red-500" },
    };

    const { label, className } = statusMap[status] || statusMap.pending;
    return <Badge className={`${className} text-white`}>{label}</Badge>;
  };

  const handleContactUser = (e, targetUser) => {
    e.stopPropagation();
    // 避免和自己对话
    if (targetUser._id === user._id) {
      return;
    }
    navigate("/inbox", {
      state: {
        seller: {
          _id: targetUser._id,
          username: targetUser.username,
          avatar: targetUser.avatar,
        },
      },
    });
  };

  const renderOrders = (status) => {
    const filteredOrders =
      status === "all"
        ? orders
        : orders.filter((order) => order.status === status);

    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      );
    }

    return filteredOrders.length > 0 ? (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        {status === "cancelled" ? "No cancelled orders" : "No orders"}
      </div>
    );
  };

  const OrderCard = ({ order }) => {
    // 确保user存在
    if (!user) {
      return null;
    }

    // 判断当前用户是买家还是卖家
    const isBuyer =
      user._id &&
      order.buyer._id &&
      user._id.toString() === order.buyer._id.toString();
    const otherUser = isBuyer ? order.seller : order.buyer;

    // 确保otherUser存在
    if (!otherUser) {
      return null;
    }

    return (
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/orders/${order._id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 overflow-hidden rounded-lg">
              <img
                src={order.product.images[0]}
                alt={order.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{order.product.name}</h3>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={order.seller.avatar} />
                  <AvatarFallback>{order.seller.username[0]}</AvatarFallback>
                </Avatar>
                <span>{order.seller.username}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">RM {order.price}</span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleContactUser(e, order.seller)}
                  >
                    Contact Seller
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  OrderCard.propTypes = {
    order: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        images: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      seller: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      buyer: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <div className="flex items-center min-h-[calc(100vh-4rem)]">
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
                <CardDescription>
                  View and manage all your orders
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderOrders("all")}</TabsContent>
              <TabsContent value="pending">
                {renderOrders("pending")}
              </TabsContent>
              <TabsContent value="completed">
                {renderOrders("completed")}
              </TabsContent>
              <TabsContent value="cancelled">
                {renderOrders("cancelled")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
