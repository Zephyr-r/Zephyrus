import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      setIsEmailSent(true);
      toast({
        title: "邮件已发送",
        description: "请查看您的邮箱",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "发送失败",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">忘记密码</CardTitle>
          <CardDescription>
            {!isEmailSent
              ? "请输入您的邮箱地址，我们将发送重置密码链接给您"
              : "重置密码链接已发送，请查看您的邮箱"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isEmailSent ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !email.includes("@")}
                >
                  {isSubmitting ? "发送中..." : "发送重置链接"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                如果该邮箱已注册，您将收到一封包含重置密码链接的邮件。
                请检查您的收件箱和垃圾邮件文件夹。
              </p>
              <p className="text-sm text-gray-600">链接有效期为30分钟。</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
          >
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
