
import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

// Interface to avoid complex typing issues
interface ProfileResult {
  is_blocked?: boolean;
  is_approved?: boolean;
  role?: UserRole;
  email?: string;
}

export const authService = {
  /**
   * Get the current session
   */
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Fetch user profile by user ID
   */
  fetchUserProfile: async (userId: string, session: Session | null) => {
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
        // Check if the user is blocked and handle accordingly
        if (data.is_blocked) {
          await authService.signOut();
          throw new Error("Your account has been blocked. Please contact an administrator for assistance.");
        }
        
        // Check if the user is a doctor and not approved
        if (data.role === UserRole.DOCTOR && data.is_approved === false) {
          // Sign out and throw error
          await authService.signOut();
          throw new Error("Your doctor account is pending approval by an administrator. You will be able to access the platform once approved.");
        }

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
        
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Check if user is blocked before login
   */
  checkIfUserBlocked: async (email: string): Promise<boolean> => {
    try {
      // Use explicit return type to avoid complex type inference
      const { data } = await supabase
        .from("profiles")
        .select("is_blocked")
        .eq("email", email)
        .maybeSingle();
      
      return data?.is_blocked || false;
    } catch (error) {
      console.error("Error checking if user is blocked:", error);
      return false;
    }
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    // First check if the user is blocked
    const isBlocked = await authService.checkIfUserBlocked(email);
    
    if (isBlocked) {
      throw new Error("Your account has been blocked. Please contact an administrator for assistance.");
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return data;
  },

  /**
   * Register a new user
   */
  register: async (userData: Partial<User>, password: string) => {
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
    
    // For doctors, sign out as they need approval
    if (userData.role === UserRole.DOCTOR) {
      await authService.signOut();
    }
    
    return data;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId: string, data: Partial<User>) => {
    if (!userId) {
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
      .eq("id", userId);
    
    if (error) throw error;
  },

  /**
   * Set up auth state change listener
   */
  onAuthStateChange: (callback: (session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      callback(session);
    });
  }
};
