import React, { createContext, useState, useEffect } from "react";
import { User, AuthContextType, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Session } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/useAuth";

export { useAuth };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth provider component
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange(
      async (currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          try {
            const userProfile = await authService.fetchUserProfile(currentSession.user.id, currentSession);
            setUser(userProfile);
          } catch (error) {
            if (error instanceof Error) {
              toast({
                title: "Authentication Error",
                description: error.message,
                variant: "destructive",
              });
            }
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    );

    const initSession = async () => {
      try {
        setIsLoading(true);
        const initialSession = await authService.getSession();
        setSession(initialSession);
        
        if (initialSession) {
          try {
            const userProfile = await authService.fetchUserProfile(initialSession.user.id, initialSession);
            setUser(userProfile);
          } catch (error) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      await authService.login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
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
      
      await authService.register(userData, password);
      
      if (userData.role === UserRole.DOCTOR) {
        setUser(null);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created and is pending approval by an administrator.",
        });
      } else {
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
      }
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
    try {
      setIsLoading(true);
      await authService.signOut();
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("No user is logged in");
      }
      
      await authService.updateUserProfile(user.id, data);
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
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
