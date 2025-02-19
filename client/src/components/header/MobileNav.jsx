import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineOrderedList,
  AiOutlineMessage,
  AiOutlineSetting,
  AiOutlineUser,
} from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";

export function MobileNav() {
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        <Link to="/" className="flex flex-col items-center p-2">
          <AiOutlineHome className="h-6 w-6" />
          <span className="text-xs mt-1">首页</span>
        </Link>

        {user ? (
          <>
            <Link to="/orders" className="flex flex-col items-center p-2">
              <AiOutlineOrderedList className="h-6 w-6" />
              <span className="text-xs mt-1">订单</span>
            </Link>

            <Link to="/inbox" className="flex flex-col items-center p-2">
              <AiOutlineMessage className="h-6 w-6" />
              <span className="text-xs mt-1">消息</span>
            </Link>

            <Link to="/setting" className="flex flex-col items-center p-2">
              <AiOutlineSetting className="h-6 w-6" />
              <span className="text-xs mt-1">我的</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="flex flex-col items-center p-2">
              <AiOutlineUser className="h-6 w-6" />
              <span className="text-xs mt-1">登录</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
