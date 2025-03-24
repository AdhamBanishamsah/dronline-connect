
import { User, UserRole } from "@/types";
import { MOCK_USERS, MockUser } from "@/data/mockUsers";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
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
    
    return userWithoutPassword as User;
  },
  
  register: async (userData: Partial<User>, password: string): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === userData.email)) {
      throw new Error("Email already in use");
    }
    
    // Create a new user without password
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
    
    // Create a new mock user that includes the password and add to mock database
    const newMockUser: MockUser = {
      ...newUser,
      password,
    };
    
    MOCK_USERS.push(newMockUser);
    
    return newUser;
  },
  
  updateProfile: async (currentUser: User, data: Partial<User>): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!currentUser) {
      throw new Error("No user is logged in");
    }
    
    // Update user in state and localStorage
    return { ...currentUser, ...data };
  }
};
