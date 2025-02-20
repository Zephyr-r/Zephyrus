import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/user/ProfileForm";
import { PasswordForm } from "@/components/user/PasswordForm";
import { useUserProfile } from "@/hooks/useUserProfile";

const Setting = () => {
  const {
    loading,
    userData,
    setUserData,
    passwordForm,
    setPasswordForm,
    canUpdateUsername,
    handleProfileSubmit,
    handlePasswordSubmit,
  } = useUserProfile();

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 选项卡切换编辑资料和修改密码 */}
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Edit Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>

            {/* 个人资料编辑表单 */}
            <TabsContent value="profile">
              <ProfileForm
                userData={userData}
                onUserDataChange={setUserData}
                onSubmit={handleProfileSubmit}
                loading={loading}
                canUpdateUsername={canUpdateUsername}
              />
            </TabsContent>

            {/* 修改密码表单 */}
            <TabsContent value="password">
              <PasswordForm
                passwordForm={passwordForm}
                onPasswordFormChange={setPasswordForm}
                onSubmit={handlePasswordSubmit}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setting;
