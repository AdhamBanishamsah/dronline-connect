
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        if (currentSession) {
          fetchUserProfile(currentSession.user.id);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const initSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        
        if (initialSession) {
          await fetchUserProfile(initialSession.user.id);
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
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const userProfile: User = {
          id: data.id,
          email: session?.user?.email || "",
          fullName: data.full_name,
          role: data.role as UserRole,
          phoneNumber: data.phone_number,
          dateOfBirth: data.date_of_birth,
          specialty: data.specialty,
          isApproved: data.is_approved
        };
        
        setUser(userProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // User details will be set by the onAuthStateChange listener
      
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
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
            phone_number: userData.phoneNumber,
            date_of_birth: userData.dateOfBirth,
            specialty: userData.specialty,
          }
        }
      });
      
      if (error) throw error;
      
      // For doctors, don't log them in automatically as they need approval
      if (userData.role === UserRole.DOCTOR) {
        // Sign out if they were auto-signed in
        await supabase.auth.signOut();
        setUser(null);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created and is pending approval by an administrator.",
        });
      } else {
        // For patients, they will be logged in automatically through onAuthStateChange
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
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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
      
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          date_of_birth: data.dateOfBirth,
          specialty: data.specialty,
        })
        .eq("id", user.id);
      
      if (error) throw error;
      
      // Update local user state
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
