import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUser, logout } from "@/api/auth";
import { authState } from "@/App";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        if (!mounted) return;

        if (response?.user) {
          authState.setUser(response.user);
        } else {
          authState.setUser(null);
        }
      } catch (error) {
        if (
          error.message.includes("401") ||
          error.message.includes("Authentication")
        ) {
          authState.setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (!authState.user) {
      fetchUser();
    } else {
      setLoading(false);
    }

    // 监听头像更新事件
    const handleAvatarUpdate = (event) => {
      if (authState.user) {
        authState.setUser((prev) => ({
          ...prev,
          avatar: event.detail.avatar,
        }));
      }
    };

    window.addEventListener("userAvatarUpdate", handleAvatarUpdate);

    return () => {
      mounted = false;
      window.removeEventListener("userAvatarUpdate", handleAvatarUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      authState.setUser(null);
      toast({
        title: "登出成功",
        description: "期待您的再次光临！",
      });
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "登出失败",
        description: error.message,
      });
    }
  };

  const requireAuth = (callback) => {
    if (!authState.user) {
      toast({
        title: "请先登录",
        description: "此操作需要登录账号",
      });
      navigate("/login");
      return;
    }
    callback();
  };

  return {
    user: authState.user,
    loading,
    setUser: authState.setUser,
    handleLogout,
    requireAuth,
    isAuthenticated: !!authState.user,
  };
}
