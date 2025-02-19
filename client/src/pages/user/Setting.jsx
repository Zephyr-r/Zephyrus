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
          <CardTitle>设置</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">编辑资料</TabsTrigger>
              <TabsTrigger value="password">修改密码</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm
                userData={userData}
                onUserDataChange={setUserData}
                onSubmit={handleProfileSubmit}
                loading={loading}
                canUpdateUsername={canUpdateUsername}
              />
            </TabsContent>

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
