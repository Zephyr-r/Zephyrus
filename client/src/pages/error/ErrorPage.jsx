import { useRouteError, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // 根据错误类型返回合适的错误信息
  const getErrorMessage = () => {
    if (error.status === 404) {
      return {
        title: "页面未找到",
        description: "您访问的页面可能已被移除或暂时无法访问",
        suggestion: "您可以返回首页，或尝试其他操作",
      };
    }

    if (error.status === 403) {
      return {
        title: "访问受限",
        description: "您没有权限访问此页面",
        suggestion: "请先登录，或联系客服获取帮助",
      };
    }

    return {
      title: "系统错误",
      description: error.message || "抱歉，出现了一些问题",
      suggestion: "请稍后再试，或联系客服获取帮助",
    };
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">{errorInfo.title}</CardTitle>
          <CardDescription>{errorInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-sm text-muted-foreground">
            {errorInfo.suggestion}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            返回上页
          </Button>
          <Button asChild>
            <Link to="/">返回首页</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorPage;
