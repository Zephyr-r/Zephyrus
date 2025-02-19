import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData);
      // 更新用户状态
      setUser(response.user);
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      });
      navigate("/"); // 登录成功后跳转到首页
    } catch (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: error.message || "用户名或密码错误",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            登录账户
          </CardTitle>
          <CardDescription className="text-center">
            输入您的账户信息
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="请输入用户名"
                required
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                忘记密码？
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !formData.username || !formData.password}
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            还没有账户？{" "}
            <Link to="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
