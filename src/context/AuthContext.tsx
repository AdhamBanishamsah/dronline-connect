
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS = [
  {
    id: "1",
    email: "patient@example.com",
    password: "password",
    fullName: "Patient User",
    role: UserRole.PATIENT,
    phoneNumber: "97743495",
    dateOfBirth: "1980-08-15",
  },
  {
    id: "2",
    email: "doctor@example.com",
    password: "password",
    fullName: "Doctor User",
    role: UserRole.DOCTOR,
    specialty: "General Medicine",
    isApproved: true,
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password",
    fullName: "Admin User",
    role: UserRole.ADMIN,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("drOnlineUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user in mock data
      const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }

      // Check if doctor is approved
      if (foundUser.role === UserRole.DOCTOR && !foundUser.isApproved) {
        throw new Error("Your account is pending approval. Please wait for administrator approval.");
      }

      // Remove password for security
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in state and localStorage
      setUser(userWithoutPassword as User);
      localStorage.setItem("drOnlineUser", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.fullName}`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email already exists
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      // For this mock implementation, we'll just simulate a successful registration
      // In a real app, we would call an API to create the user
      
      const newUser: User = {
        id: `${MOCK_USERS.length + 1}`,
        email: userData.email!,
        fullName: userData.fullName || "User",
        role: userData.role || UserRole.PATIENT,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        specialty: userData.specialty,
        isApproved: userData.role === UserRole.DOCTOR ? false : true,
      };
      
      // For doctors, don't log them in automatically as they need approval
      if (userData.role === UserRole.DOCTOR) {
        toast({
          title: "Registration successful",
          description: "Your account has been created and is pending approval by an administrator.",
        });
      } else {
        // For patients, log them in automatically
        setUser(newUser);
        localStorage.setItem("drOnlineUser", JSON.stringify(newUser));
        
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
      }
      
      // In a real app, we would add the user to the database here
      MOCK_USERS.push({ ...newUser, password });
      
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem("drOnlineUser");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error("No user is logged in");
      }
      
      // Update user in state and localStorage
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("drOnlineUser", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
