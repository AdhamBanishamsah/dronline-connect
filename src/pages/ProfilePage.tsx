
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types";

const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>(user || {});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('error'));
      }
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError(t('minPasswordLength'));
      return;
    }

    // In a real app, we would call an API to change the password
    // For this demo, we'll just simulate success
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">{t('myProfile')}</h1>
      <p className="text-gray-600 mb-8">
        {t('updatePersonalDetails')}
      </p>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">{t('personalInformation')}</TabsTrigger>
          <TabsTrigger value="security">{t('security')}</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInformation')}</CardTitle>
              <CardDescription>
                {t('updatePersonalDetails')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t('fullName')}</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                      disabled
                    />
                    <p className="text-xs text-gray-500">{t('emailCannotBeChanged')}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">{t('dateOfBirth')}</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth?.split("T")[0] || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-medical-primary hover:opacity-90">
                      {isLoading ? t('loading') : t('save')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('fullName')}</h3>
                    <p className="mt-1">{user.fullName}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('email')}</h3>
                    <p className="mt-1">{user.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('phoneNumber')}</h3>
                    <p className="mt-1">{user.phoneNumber || "-"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('dateOfBirth')}</h3>
                    <p className="mt-1">
                      {user.dateOfBirth 
                        ? new Date(user.dateOfBirth).toLocaleDateString() 
                        : "-"}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-medical-primary hover:opacity-90"
                    >
                      {t('edit')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('security')}</CardTitle>
              <CardDescription>
                {t('manageSecuritySettings')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              {isChangingPassword ? (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('newPassword')}</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      {t('minPasswordLength')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('confirmNewPassword')}</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      {t('cancel')}
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-medical-primary hover:opacity-90">
                      {isLoading ? t('changingPassword') : t('updatePassword')}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('password')}</h3>
                    <p className="mt-1">••••••••</p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={() => setIsChangingPassword(true)}
                      className="bg-medical-primary hover:opacity-90"
                    >
                      {t('updatePassword')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
