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
        title: "Page Not Found",
        description:
          "The page you are looking for may have been moved or is temporarily unavailable.",
        suggestion: "You can return to the homepage or try another action.",
      };
    }

    if (error.status === 403) {
      return {
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        suggestion: "Please log in or contact support for assistance.",
      };
    }

    return {
      title: "System Error",
      description: error.message || "Sorry, something went wrong.",
      suggestion: "Please try again later or contact support for assistance.",
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
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">Return to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorPage;
