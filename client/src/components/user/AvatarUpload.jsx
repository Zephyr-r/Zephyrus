import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { updateAvatar } from "@/api/users";
import PropTypes from "prop-types";

export const AvatarUpload = ({
  avatar,
  firstName,
  onAvatarChange,
  disabled,
}) => {
  const { toast } = useToast();

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Avatar image must not exceed 5MB",
      });
      return;
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    try {
      // 将文件转换为 base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

      reader.readAsDataURL(file);
      const base64String = await base64Promise;
      const response = await updateAvatar(base64String);
      onAvatarChange(response.avatar);

      toast({
        title: "Avatar updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Avatar update failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatar} />
        <AvatarFallback>{firstName?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => document.getElementById("avatar-upload").click()}
        >
          {disabled ? "Uploading..." : "Change Avatar"}
        </Button>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </div>
    </div>
  );
};

AvatarUpload.propTypes = {
  avatar: PropTypes.string,
  firstName: PropTypes.string,
  onAvatarChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
