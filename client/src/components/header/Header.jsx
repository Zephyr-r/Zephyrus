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

            {/* 桌面端分类菜单 */}
            <CategoryMenu />
          </div>

          {/* 中间：搜索栏 */}
          <SearchBar />

          {/* 右侧：导航按钮 */}
          <div className="flex items-center space-x-2 md:space-x-6">
            {/* 用户菜单 */}
            <UserMenu />

            {/* 订单按钮 */}
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

            {/* 消息按钮 */}
            {!loading && (
              <Button
                variant="ghost"
                size="lg"
                asChild
                className="text-base hover:bg-transparent hover:text-primary bg-transparent"
                onClick={() => {
                  if (!user) {
                    toast({
                      title: "Please log in",
                      description: "You need to log in to view messages",
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

            {/* 发布商品按钮 */}
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
