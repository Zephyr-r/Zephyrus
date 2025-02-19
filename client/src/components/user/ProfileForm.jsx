import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUpload } from "./AvatarUpload";
import PropTypes from "prop-types";

export const ProfileForm = ({
  userData,
  onUserDataChange,
  onSubmit,
  loading,
  canUpdateUsername,
}) => {
  const handleChange = (field) => (e) => {
    onUserDataChange({ ...userData, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AvatarUpload
        avatar={userData.avatar}
        firstName={userData.firstName}
        onAvatarChange={(avatar) => onUserDataChange({ ...userData, avatar })}
        disabled={loading}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">名字</Label>
          <Input
            id="firstName"
            value={userData.firstName}
            onChange={handleChange("firstName")}
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">姓氏</Label>
          <Input
            id="lastName"
            value={userData.lastName}
            onChange={handleChange("lastName")}
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">用户名</Label>
        <Input
          id="username"
          value={userData.username}
          onChange={handleChange("username")}
          disabled={loading || !canUpdateUsername}
        />
        {!canUpdateUsername && (
          <p className="text-sm text-muted-foreground">
            用户名每30天只能修改一次
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">个人简介</Label>
        <Textarea
          id="bio"
          value={userData.bio}
          onChange={handleChange("bio")}
          disabled={loading}
          placeholder="介绍一下你自己..."
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : "保存更改"}
      </Button>
    </form>
  );
};

ProfileForm.propTypes = {
  userData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onUserDataChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  canUpdateUsername: PropTypes.bool,
};
