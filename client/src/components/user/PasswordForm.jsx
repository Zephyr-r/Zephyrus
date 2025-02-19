import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

export const PasswordForm = ({
  passwordForm,
  onPasswordFormChange,
  onSubmit,
  loading,
}) => {
  const handleChange = (field) => (e) => {
    onPasswordFormChange({ ...passwordForm, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">当前密码</Label>
        <Input
          id="currentPassword"
          type="password"
          value={passwordForm.currentPassword}
          onChange={handleChange("currentPassword")}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">新密码</Label>
        <Input
          id="newPassword"
          type="password"
          value={passwordForm.newPassword}
          onChange={handleChange("newPassword")}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">确认新密码</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={passwordForm.confirmPassword}
          onChange={handleChange("confirmPassword")}
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "修改中..." : "修改密码"}
      </Button>
    </form>
  );
};

PasswordForm.propTypes = {
  passwordForm: PropTypes.shape({
    currentPassword: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
  }).isRequired,
  onPasswordFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
