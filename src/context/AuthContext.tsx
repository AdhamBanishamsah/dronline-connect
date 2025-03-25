
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, AuthContextType, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { useLanguage } from "@/context/LanguageContext";

// Create the auth context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access the auth context
 */
export const useAuth = () => {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

/**
 * Auth provider component
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  // Initialize auth and set up listener
  useEffect(() => {
    // Set up auth state listener
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
                title: t("error"),
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

    // Check for existing session
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
            // Error already handled by the service
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
  }, [toast, t]);

  /**
   * Login handler
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      await authService.login(email, password);
      
      // User will be set by the onAuthStateChange listener
      toast({
        title: t("signIn"),
        description: t("welcomeBack"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register handler
   */
  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      
      await authService.register(userData, password);
      
      // For doctors, don't log them in automatically as they need approval
      if (userData.role === UserRole.DOCTOR) {
        setUser(null);
        
        toast({
          title: t("createAccount"),
          description: t("doctorApprovalMessage"),
        });
      } else {
        // For patients, they will be logged in automatically through onAuthStateChange
        toast({
          title: t("createAccount"),
          description: t("createYourAccount"),
        });
      }
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Try using the direct supabase client to sign out
      await supabase.auth.signOut();
      
      // Clear the user state regardless of API call success
      setUser(null);
      setSession(null);
      
      toast({
        title: t("signOut"),
        description: t("signOut"),
      });
    } catch (error) {
      console.error("Logout error:", error);
      
      // Still clear the user state
      setUser(null);
      setSession(null);
      
      toast({
        title: t("error"),
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user profile handler
   */
  const updateUserProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error(t("error"));
      }
      
      await authService.updateUserProfile(user.id, data);
      
      // Update local user state
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      
      toast({
        title: t("save"),
        description: t("updatePersonalDetails"),
      });
    } catch (error) {
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : t("error"),
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create context value
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
