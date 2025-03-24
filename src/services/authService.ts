import { User, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw new Error(error.message);
      
      if (!data.user) {
        throw new Error("User not found");
      }
      
      // Fetch user profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      if (profileError) throw new Error(profileError.message);
      
      // Check if doctor is approved
      if (profileData.role === UserRole.DOCTOR && !profileData.is_approved) {
        throw new Error("Your account is pending approval. Please wait for administrator approval.");
      }
      
      // Create a User object from the profile data
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        fullName: profileData.full_name,
        role: profileData.role as UserRole,
        phoneNumber: profileData.phone_number,
        dateOfBirth: profileData.date_of_birth,
        specialty: profileData.specialty,
        isApproved: profileData.is_approved
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: Partial<User>, password: string): Promise<User> => {
    try {
      // Special case for admin registration (for demo purposes)
      if (userData.email === "admin@example.com" && userData.role === UserRole.ADMIN) {
        // Check if admin already exists to prevent duplicates
        const { data: existingUser } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", userData.email)
          .single();
          
        if (!existingUser) {
          // Use Supabase to create a new admin user
          const { data, error } = await supabase.auth.signUp({
            email: userData.email!,
            password,
            options: {
              data: {
                full_name: userData.fullName || "Admin User",
                role: UserRole.ADMIN,
              }
            }
          });
          
          if (error) throw new Error(error.message);
          
          if (!data.user) {
            throw new Error("Failed to create admin user");
          }
          
          // Create an admin User object
          const adminUser: User = {
            id: data.user.id,
            email: data.user.email || "",
            fullName: userData.fullName || "Admin User",
            role: UserRole.ADMIN,
            isApproved: true,
          };
          
          return adminUser;
        }
      }
      
      // Regular user registration (existing code)
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
      
      if (error) throw new Error(error.message);
      
      if (!data.user) {
        throw new Error("Failed to create user");
      }
      
      // For doctors, don't log them in automatically as they need approval
      if (userData.role === UserRole.DOCTOR) {
        // Sign out if they were auto-signed in
        await supabase.auth.signOut();
      }
      
      // Create a User object
      const user: User = {
        id: data.user.id,
        email: data.user.email || "",
        fullName: userData.fullName || "User",
        role: userData.role || UserRole.PATIENT,
        phoneNumber: userData.phoneNumber,
        dateOfBirth: userData.dateOfBirth,
        specialty: userData.specialty,
        isApproved: userData.role === UserRole.DOCTOR ? false : true,
      };
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  createAdminAccount: async (): Promise<void> => {
    try {
      // Check if admin already exists
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const adminExists = users.some(user => 
        user.email === "admin@example.com" && 
        user.user_metadata?.role === UserRole.ADMIN
      );
      
      if (!adminExists) {
        // Create admin user
        await authService.register(
          {
            email: "admin@example.com",
            fullName: "Admin User",
            role: UserRole.ADMIN,
          },
          "password"
        );
        console.log("Admin account created successfully");
      }
    } catch (error) {
      console.error("Error creating admin account:", error);
    }
  },
  
  updateProfile: async (currentUser: User, data: Partial<User>): Promise<User> => {
    try {
      if (!currentUser) {
        throw new Error("No user is logged in");
      }
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          date_of_birth: data.dateOfBirth,
          specialty: data.specialty,
        })
        .eq("id", currentUser.id);
      
      if (error) throw new Error(error.message);
      
      // Return updated user
      return { ...currentUser, ...data };
    } catch (error) {
      throw error;
    }
  }
};
