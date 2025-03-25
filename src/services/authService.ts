
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if user is blocked before allowing login
    if (data.user) {
      const isBlocked = await this.checkIfUserBlocked(data.user.id);
      if (isBlocked) {
        // Sign out immediately if user is blocked
        await supabase.auth.signOut();
        throw new Error("Your account has been blocked. Please contact support.");
      }
    }

    return data;
  },

  async register(userData: Partial<User>, password: string) {
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
        },
      },
    });

    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;

    // Check if user is blocked
    const isBlocked = await this.checkIfUserBlocked(session.user.id);
    if (isBlocked) {
      // Sign out immediately if user is blocked
      await supabase.auth.signOut();
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      fullName: profileData.full_name,
      role: profileData.role as UserRole,
      phoneNumber: profileData.phone_number,
      dateOfBirth: profileData.date_of_birth,
      specialty: profileData.specialty,
      isApproved: profileData.is_approved,
    };
  },

  async checkIfUserBlocked(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_blocked")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking if user is blocked:", error);
      return false;
    }

    return data?.is_blocked || false;
  },

  async updateUserProfile(userId: string, userData: Partial<User>) {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: userData.fullName,
        phone_number: userData.phoneNumber,
        date_of_birth: userData.dateOfBirth,
        specialty: userData.specialty,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Add Supabase auth listener
  onAuthStateChange(callback: (session: any) => void) {
    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session);
      }
    );
    return data;
  },

  // Get current session
  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // Fetch user profile
  async fetchUserProfile(userId: string, session: any) {
    if (!userId || !session) return null;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
    
    return {
      id: userId,
      email: session.user?.email || "",
      fullName: data.full_name,
      role: data.role as UserRole,
      phoneNumber: data.phone_number,
      dateOfBirth: data.date_of_birth,
      specialty: data.specialty,
      isApproved: data.is_approved,
    };
  },

  // Rename logout to signOut for consistency
  async signOut() {
    return this.logout();
  }
};
