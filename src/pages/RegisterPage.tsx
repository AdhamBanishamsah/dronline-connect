import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";
const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    register
  } = useAuth();
  const {
    t,
    dir
  } = useLanguage();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError(t("requiredFields"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("minPasswordLength"));
      return;
    }

    // Additional validation for doctors
    if (role === UserRole.DOCTOR && !specialty) {
      setError(t("enterSpecialty"));
      return;
    }
    try {
      setIsSubmitting(true);
      await register({
        fullName,
        email,
        role,
        phoneNumber: phoneNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
        specialty: specialty || undefined
      }, password);

      // For doctors, redirect to a waiting page with a clear message
      if (role === UserRole.DOCTOR) {
        navigate("/login", {
          state: {
            message: t("doctorApprovalMessage")
          }
        });
      } else {
        // For patients, redirect to home
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t("error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="flex justify-center items-center min-h-[calc(100vh-120px)] py-8 animate-fade-in" dir={dir}>
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t("createAccount")}</CardTitle>
          <CardDescription className="text-center">
            {t("createYourAccount")}
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="patient" className="w-full" onValueChange={v => setRole(v as UserRole)}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value={UserRole.PATIENT}>{t("imPatient")}</TabsTrigger>
            <TabsTrigger value={UserRole.DOCTOR}>{t("imDoctor")}</TabsTrigger>
          </TabsList>
          
          {role === UserRole.DOCTOR && <Alert className="mt-4 mx-6 bg-blue-50 text-blue-800 border-blue-2">
              <AlertDescription>
                {t("doctorApprovalRequired")}
              </AlertDescription>
            </Alert>}
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("fullName")} *</Label>
                <Input id="fullName" placeholder={t("fullName")} value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")} *</Label>
                <Input id="email" type="email" placeholder={t("enterEmail")} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t("password")} *</Label>
                  <Input id="password" type="password" placeholder={t("enterPassword")} value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t("confirmPassword")} *</Label>
                  <Input id="confirmPassword" type="password" placeholder={t("confirmPassword")} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              
              <TabsContent value={UserRole.PATIENT} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input id="phoneNumber" type="tel" placeholder={t("phoneNumber")} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
                  <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
                </div>
              </TabsContent>
              
              <TabsContent value={UserRole.DOCTOR} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">{t("specialty")} *</Label>
                  <Input id="specialty" placeholder={t("enterSpecialty")} value={specialty} onChange={e => setSpecialty(e.target.value)} required={role === UserRole.DOCTOR} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input id="phoneNumber" type="tel" placeholder={t("phoneNumber")} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-medical-primary hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? t("creatingAccount") : t("createAccount")}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                {t("alreadyHaveAccount")}{" "}
                <Link to="/login" className="text-medical-primary hover:underline">
                  {t("signIn")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>;
};
export default RegisterPage;