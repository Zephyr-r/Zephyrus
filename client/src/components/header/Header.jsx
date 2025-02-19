import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AiOutlineOrderedList,
  AiOutlineMessage,
  AiOutlineDollar,
} from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SearchBar } from "./SearchBar";
import { UserMenu } from "./UserMenu";
import { CategoryMenu } from "./CategoryMenu";
import { MobileMenu } from "./MobileMenu";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { user, loading, requireAuth } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <header className="w-full border-b fixed top-0 bg-white z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between py-4 text-base">
          {/* 左侧：移动端菜单和Logo */}
          <div className="flex items-center gap-8">
            <MobileMenu />

            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold hover:text-primary transition-colors"
            >
              Zephyrus
            </Link>

            {/* Desktop Categories */}
            <CategoryMenu />
          </div>

          {/* 中间：搜索栏 */}
          <SearchBar />

          {/* 右侧：导航按钮 */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {/* User Menu */}
            <UserMenu />

            {/* Orders Button */}
            {!loading && user && (
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-base hover:bg-transparent hover:text-primary bg-transparent"
              >
                <Link to="/orders" className="hidden md:flex md:items-center">
                  <AiOutlineOrderedList className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Orders</span>
                </Link>
              </Button>
            )}

            {/* Inbox Button */}
            {!loading && (
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-base hover:bg-transparent hover:text-primary bg-transparent"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "请先登录",
                      description: "查看消息需要登录账号",
                    });
                    navigate("/login");
                    return;
                  }
                }}
              >
                <Link
                  to={user ? "/inbox" : "#"}
                  className="hidden md:flex md:items-center"
                >
                  <AiOutlineMessage className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Inbox</span>
                </Link>
              </Button>
            )}

            {/* Sell Button */}
            {!loading && (
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-base hover:bg-transparent hover:text-red-500 bg-transparent"
                onClick={() => requireAuth(() => {})}
              >
                <Link
                  to={user ? "/sell" : "#"}
                  className="hidden md:flex md:items-center"
                >
                  <AiOutlineDollar className="h-5 w-5 md:mr-2" />
                  <span className="hidden md:inline">Sell</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* 移动端搜索栏 */}
        <div className="md:hidden pb-4">
          <SearchBar isMobile />
        </div>

        {/* 移动端底部导航 */}
        <MobileNav />
      </div>
    </header>
  );
}
