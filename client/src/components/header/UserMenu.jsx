import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
} from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const { user, loading, handleLogout } = useAuth();

  if (loading) {
    return (
      <Button
        variant="ghost"
        size="lg"
        className="text-base hover:bg-transparent hover:text-primary bg-transparent"
        disabled
      >
        <AiOutlineUser className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          size="lg"
          className="text-base hover:bg-transparent hover:text-primary bg-transparent group"
        >
          <Avatar className="h-8 w-8 mr-3 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <div className="text-sm text-gray-500 font-normal">
              Welcome back
            </div>
            <div className="text-base font-bold text-gray-900 -mt-1">
              {user.username}
            </div>
          </div>
        </Button>

        <div className="absolute right-0 top-full w-[200px] bg-white border rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b">
              <div className="font-medium">{user.username}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
            <Link to="/setting" className="block px-4 py-2 hover:bg-neutral-50">
              <AiOutlineSetting className="h-5 w-5 inline-block mr-2" />
              设置
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-red-500"
            >
              <AiOutlineLogout className="h-5 w-5 inline-block mr-2" />
              登出
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="lg"
        className="text-base hover:bg-transparent hover:text-primary bg-transparent"
      >
        <AiOutlineUser className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Login</span>
      </Button>

      <div className="absolute right-0 top-full w-[200px] bg-white border rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="px-4 py-3">
          <Button asChild className="w-full justify-center mb-2 rounded-full">
            <Link to="/login">Sign In</Link>
          </Button>
          <Link
            to="/register"
            className="block text-xs text-gray-500 text-center hover:text-primary"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
