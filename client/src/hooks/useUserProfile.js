import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateProfile, changePassword } from "@/api/users";
import { getCurrentUser } from "@/api/auth";

export const useUserProfile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastUsernameUpdate, setLastUsernameUpdate] = useState(null);
  const [originalUsername, setOriginalUsername] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    avatar: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 获取用户信息
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response?.user) {
          setUserData({
            firstName: response.user.firstName || "",
            lastName: response.user.lastName || "",
            username: response.user.username || "",
            bio: response.user.bio || "",
            avatar: response.user.avatar || "",
          });
          setOriginalUsername(response.user.username || "");
          setLastUsernameUpdate(response.user.lastUsernameUpdate);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "获取用户信息失败",
          description: error.message,
        });
      }
    };

    fetchUserData();
  }, [toast]);

  const canUpdateUsername = () => {
    if (!lastUsernameUpdate) return true;
    const lastUpdate = new Date(lastUsernameUpdate);
    const daysSinceLastUpdate =
      (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastUpdate >= 30;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!canUpdateUsername() && userData.username !== originalUsername) {
      toast({
        variant: "destructive",
        title: "用户名修改受限",
        description: "用户名每30天只能修改一次",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await updateProfile(userData);
      setUserData(response);
      toast({
        title: "个人资料更新成功",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "更新失败",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "密码不匹配",
        description: "两次输入的新密码不一致",
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast({
        title: "密码修改成功",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "密码修改失败",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    userData,
    setUserData,
    passwordForm,
    setPasswordForm,
    canUpdateUsername: canUpdateUsername(),
    handleProfileSubmit,
    handlePasswordSubmit,
  };
};
