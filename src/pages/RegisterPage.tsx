
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/authService";

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
  const [showAdminOption, setShowAdminOption] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Enable admin registration with a special key combo (Shift + Alt + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key === 'A') {
        setShowAdminOption(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Additional validation for doctors
    if (role === UserRole.DOCTOR && !specialty) {
      setError("Please enter your medical specialty");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await register(
        {
          fullName,
          email,
          role,
          phoneNumber: phoneNumber || undefined,
          dateOfBirth: dateOfBirth || undefined,
          specialty: specialty || undefined,
        },
        password
      );
      
      // For doctors, redirect to a waiting page
      if (role === UserRole.DOCTOR) {
        navigate("/login", { state: { message: "Registration successful. Please wait for admin approval." } });
      } else if (role === UserRole.ADMIN) {
        navigate("/login", { state: { message: "Admin account created. Please log in to access the admin dashboard." } });
      } else {
        // For patients, redirect to home
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)] py-8 animate-fade-in">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your DrOnline account
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="patient" className="w-full" onValueChange={(v) => setRole(v as UserRole)}>
          <TabsList className="grid grid-cols-2 mx-6">
            <TabsTrigger value={UserRole.PATIENT}>I'm a Patient</TabsTrigger>
            <TabsTrigger value={UserRole.DOCTOR}>I'm a Doctor</TabsTrigger>
            {showAdminOption && (
              <TabsTrigger value={UserRole.ADMIN} className="mt-2">I'm an Admin</TabsTrigger>
            )}
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <TabsContent value={UserRole.PATIENT} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value={UserRole.DOCTOR} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Medical Specialty *</Label>
                  <Input
                    id="specialty"
                    placeholder="Enter your medical specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required={role === UserRole.DOCTOR}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </TabsContent>

              {showAdminOption && (
                <TabsContent value={UserRole.ADMIN} className="space-y-4 mt-4">
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md text-sm">
                    You are creating an admin account. This account will have full access to the system.
                  </div>
                </TabsContent>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-medical-primary hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-medical-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </div>
  );
};

export default RegisterPage;
