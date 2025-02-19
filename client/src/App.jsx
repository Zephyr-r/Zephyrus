import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/api/auth";
import HomeLayout from "@/pages/layouts/HomeLayout";
import Landing from "@/pages/home/Landing";
import ProductDetail from "@/pages/product/ProductDetail";
import Setting from "@/pages/user/Setting";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Sell from "@/pages/product/Sell";
import Orders from "@/pages/order/Orders";
import Inbox from "@/pages/chat/Inbox";
import Search from "@/pages/product/Search";
import Payment from "@/pages/order/Payment";
import ErrorPage from "@/pages/error/ErrorPage";
import OrderDetail from "@/pages/order/OrderDetail";
import UserProfile from "@/pages/user/UserProfile";
import EditProduct from "@/pages/product/EditProduct";

// 创建一个全局的认证状态
export const authState = {
  user: null,
  setUser: null,
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Landing /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "product/:id/edit", element: <EditProduct /> },
      { path: "setting", element: <Setting /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "sell", element: <Sell /> },
      { path: "orders", element: <Orders /> },
      { path: "orders/:orderId", element: <OrderDetail /> },
      { path: "inbox", element: <Inbox /> },
      { path: "search", element: <Search /> },
      { path: "payment", element: <Payment /> },
      { path: "user/:userId", element: <UserProfile /> },
    ],
  },
]);

function App() {
  const [user, setUser] = useState(null);

  // 设置全局状态
  authState.user = user;
  authState.setUser = setUser;

  // 初始化时获取用户信息
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.user) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
