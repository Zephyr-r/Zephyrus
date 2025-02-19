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
import { register } from "@/api/auth";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const errors = {};
    if (formData.password.length < 6) {
      errors.password = "密码长度至少为6位";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "两次输入的密码不一致";
    }
    if (formData.username.length < 2) {
      errors.username = "用户名长度至少为2位";
    }
    if (!formData.email.includes("@")) {
      errors.email = "请输入有效的邮箱地址";
    }
    if (!formData.firstName.trim()) {
      errors.firstName = "请输入名字";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "请输入姓氏";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: "注册成功",
        description: "请登录您的账户",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "注册失败",
        description: error.message,
      });
      // 处理特定的错误
      if (error.message.includes("email")) {
        setFormErrors((prev) => ({ ...prev, email: "该邮箱已被注册" }));
      }
      if (error.message.includes("username")) {
        setFormErrors((prev) => ({ ...prev, username: "该用户名已被使用" }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 清除对应字段的错误
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      Object.keys(formErrors).length === 0
    );
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            创建账户
          </CardTitle>
          <CardDescription className="text-center">
            填写以下信息创建您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">姓氏</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="请输入姓氏"
                  required
                  className={formErrors.lastName ? "border-red-500" : ""}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">{formErrors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">名字</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="请输入名字"
                  required
                  className={formErrors.firstName ? "border-red-500" : ""}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">{formErrors.firstName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
                required
                className={formErrors.username ? "border-red-500" : ""}
              />
              {formErrors.username && (
                <p className="text-sm text-red-500">{formErrors.username}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@example.com"
                required
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={formErrors.password ? "border-red-500" : ""}
              />
              {formErrors.password && (
                <p className="text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={formErrors.confirmPassword ? "border-red-500" : ""}
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? "注册中..." : "注册"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            已有账户？{" "}
            <Link to="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
