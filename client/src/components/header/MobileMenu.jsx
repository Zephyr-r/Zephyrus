import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineCar,
  AiOutlineDollar,
  AiOutlineSetting,
  AiOutlineOrderedList,
} from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";

export function MobileMenu() {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <AiOutlineMenu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[300px] p-0">
        <div className="h-full flex flex-col">
          {/* 用户区域 */}
          <div className="p-4 border-b">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/login">
                <AiOutlineUser className="mr-2 h-5 w-5" />
                Log in / Sign up
              </Link>
            </Button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h2 className="font-semibold mb-2">Categories</h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-not-allowed opacity-60"
                  disabled
                >
                  <AiOutlineHome className="mr-2 h-5 w-5" />
                  Rent a Home (Coming Soon)
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-not-allowed opacity-60"
                  disabled
                >
                  <AiOutlineCar className="mr-2 h-5 w-5" />
                  Rent a Car (Coming Soon)
                </Button>
              </div>
            </div>

            <Separator />

            <div className="p-4">
              <div className="space-y-1">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/sell">
                    <AiOutlineDollar className="mr-2 h-5 w-5" />
                    Sell Item
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/setting">
                    <AiOutlineSetting className="mr-2 h-5 w-5" />
                    Settings
                  </Link>
                </Button>

                {user && (
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <Link to="/orders">
                      <AiOutlineOrderedList className="mr-2 h-5 w-5" />
                      My Orders
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
